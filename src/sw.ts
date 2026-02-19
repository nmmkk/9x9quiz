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

type InjectedManifestEntry = {
  url: string;
  revision?: string | null;
};

const APP_SHELL_CACHE_PREFIX = "app-shell";
const SKIP_WAITING_MESSAGE_TYPE = "SKIP_WAITING";
const NAVIGATION_NETWORK_TIMEOUT_MS = 4000;

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
const injectedManifest = self.__WB_MANIFEST as InjectedManifestEntry[] | undefined;

const resolvedPrecacheEntries = (injectedManifest ?? []).map((entry) => ({
  path: new URL(entry.url, self.location.origin).pathname,
  revision: entry.revision ?? "",
}));

const createCacheVersion = (): string => {
  const versionSeed = [
    ...APP_SHELL_URLS.map((path) => `${path}@shell`),
    ...resolvedPrecacheEntries
      .map((entry) => `${entry.path}@${entry.revision}`)
      .sort((left, right) => left.localeCompare(right)),
  ].join("|");

  let hash = 2166136261;

  for (let index = 0; index < versionSeed.length; index += 1) {
    hash ^= versionSeed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `v${(hash >>> 0).toString(16)}`;
};

const APP_SHELL_CACHE_VERSION = createCacheVersion();
const APP_SHELL_CACHE = `${APP_SHELL_CACHE_PREFIX}-${APP_SHELL_CACHE_VERSION}`;

const precacheUrls = new Set<string>(APP_SHELL_URLS);

for (const entry of resolvedPrecacheEntries) {
  precacheUrls.add(entry.path);
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

const matchAppShellFallback = async (cache: Cache): Promise<Response> => {
  return (
    (await cache.match(APP_SHELL_URLS[0])) ??
    (await cache.match(APP_SHELL_URLS[1])) ??
    Response.error()
  );
};

const matchWithoutSearch = async (cache: Cache, request: Request): Promise<Response | undefined> => {
  const requestUrl = new URL(request.url);

  if (!requestUrl.search) {
    return undefined;
  }

  return cache.match(request, { ignoreSearch: true }) ?? undefined;
};

const fetchNavigationWithTimeout = async (request: Request): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, NAVIGATION_NETWORK_TIMEOUT_MS);

  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

self.addEventListener("fetch", (rawEvent) => {
  const event = rawEvent as ServiceWorkerFetchEvent;
  const { request } = event;

  if (!isSameOriginGetRequest(request)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetchNavigationWithTimeout(request)
        .then(async (networkResponse) => {
          if (networkResponse.ok) {
            return networkResponse;
          }

          const cache = await caches.open(APP_SHELL_CACHE);
          return matchAppShellFallback(cache);
        })
        .catch(async () => {
          const cache = await caches.open(APP_SHELL_CACHE);

          return matchAppShellFallback(cache);
        }),
    );
    return;
  }

  event.respondWith(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      const cachedResponse = (await cache.match(request)) ?? (await matchWithoutSearch(cache, request));

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
