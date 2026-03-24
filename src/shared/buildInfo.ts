type BuildInfoEnv = Pick<
  ImportMetaEnv,
  "VITE_APP_VERSION" | "VITE_COMMIT_SHORT_SHA" | "VITE_COMMIT_URL"
>;

export type BuildInfo = {
  displayText: string;
  commitUrl: string | null;
};

const FALLBACK_VERSION = "0.0.0";
const FALLBACK_SHORT_SHA = "dev";

function normalizeValue(value: string | undefined, fallbackValue: string): string {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : fallbackValue;
}

function normalizeCommitUrl(value: string | undefined): string | null {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? parsedUrl.toString() : null;
  } catch {
    return null;
  }
}

export function getBuildInfo(env: BuildInfoEnv = import.meta.env): BuildInfo {
  const version = normalizeValue(env.VITE_APP_VERSION, FALLBACK_VERSION);
  const shortSha = normalizeValue(env.VITE_COMMIT_SHORT_SHA, FALLBACK_SHORT_SHA);

  return {
    displayText: `v${version} (${shortSha})`,
    commitUrl: normalizeCommitUrl(env.VITE_COMMIT_URL),
  };
}
