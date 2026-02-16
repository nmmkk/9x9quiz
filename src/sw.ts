type ServiceWorkerExtendableEvent = Event & {
  waitUntil: (promise: Promise<unknown>) => void;
};

type ServiceWorkerFetchEvent = Event & {
  request: Request;
  respondWith: (response: Promise<Response> | Response) => void;
};

type ServiceWorkerMessageEvent = Event & {
  data?: unknown;
};

const APP_SHELL_CACHE_PREFIX = "app-shell";
const APP_SHELL_CACHE_VERSION = "v2";
const APP_SHELL_CACHE = `${APP_SHELL_CACHE_PREFIX}-${APP_SHELL_CACHE_VERSION}`;
const SKIP_WAITING_MESSAGE_TYPE = "SKIP_WAITING";

const sw = self as typeof self & {
  registration?: { scope?: string };
  skipWaiting?: () => Promise<void>;
  clients?: { claim: () => Promise<void> };
};

const scopePath = new URL(sw.registration?.scope ?? self.location.origin).pathname;
const normalizedScopePath = scopePath.endsWith("/")
  ? scopePath
  : `${scopePath}/`;
const APP_SHELL_URLS: [string, string] = [
  normalizedScopePath,
  `${normalizedScopePath}index.html`,
];

// @ts-expect-error __WB_MANIFEST is injected by vite-plugin-pwa at build time.
const injectedManifest = self.__WB_MANIFEST as Array<{ url: string }> | undefined;

const precacheUrls = new Set<string>(APP_SHELL_URLS);

for (const entry of injectedManifest ?? []) {
  precacheUrls.add(new URL(entry.url, self.location.origin).pathname);
}

self.addEventListener("install", (rawEvent) => {
  const event = rawEvent as ServiceWorkerExtendableEvent;

  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(Array.from(precacheUrls))),
  );
});

self.addEventListener("message", (rawEvent) => {
  const event = rawEvent as ServiceWorkerMessageEvent;
  const message = event.data as { type?: string } | undefined;

  if (message?.type === SKIP_WAITING_MESSAGE_TYPE) {
    void sw.skipWaiting?.();
  }
});

self.addEventListener("activate", (rawEvent) => {
  const event = rawEvent as ServiceWorkerExtendableEvent;

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(`${APP_SHELL_CACHE_PREFIX}-`) &&
                cacheName !== APP_SHELL_CACHE,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => sw.clients?.claim()),
  );
});

const isSameOriginGetRequest = (request: Request): boolean => {
  if (request.method !== "GET") {
    return false;
  }

  return new URL(request.url).origin === self.location.origin;
};

self.addEventListener("fetch", (rawEvent) => {
  const event = rawEvent as ServiceWorkerFetchEvent;
  const { request } = event;

  if (!isSameOriginGetRequest(request)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(APP_SHELL_CACHE);

        return (
          (await cache.match(APP_SHELL_URLS[0])) ??
          (await cache.match(APP_SHELL_URLS[1])) ??
          Response.error()
        );
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
          const cache = await caches.open(APP_SHELL_CACHE);
          await cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        return Response.error();
      }
    }),
  );
});

export {};
