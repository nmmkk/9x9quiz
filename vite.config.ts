import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import packageJson from "./package.json";

const APP_SHELL_CACHE_BUDGET_BYTES = 2 * 1024 * 1024;
const GITHUB_PAGES_BASE_PATH = "/9x9quiz/";

function readGitValue(command: string): string | undefined {
  try {
    return execSync(command, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return undefined;
  }
}

function resolveRepositoryHttpUrl(): string | undefined {
  const repositoryUrl = typeof packageJson.repository === "object" ? packageJson.repository.url : undefined;
  const normalizedRepositoryUrl = repositoryUrl
    ?.replace(/^git\+/, "")
    .replace(/\.git$/, "")
    .replace(/^ssh:\/\/git@github\.com\//, "https://github.com/")
    .replace(/^git@github\.com:/, "https://github.com/");

  if (normalizedRepositoryUrl) {
    return normalizedRepositoryUrl;
  }

  return readGitValue("git remote get-url origin")
    ?.replace(/\.git$/, "")
    .replace(/^ssh:\/\/git@github\.com\//, "https://github.com/")
    .replace(/^git@github\.com:/, "https://github.com/");
}

function resolveBuildMetadata() {
  const version = process.env.VITE_APP_VERSION ?? packageJson.version;
  const fullSha = process.env.VITE_COMMIT_SHA ?? readGitValue("git rev-parse HEAD") ?? "dev";
  const shortShaSource = process.env.VITE_COMMIT_SHORT_SHA ?? fullSha;
  const shortSha = shortShaSource === "dev" ? "dev" : shortShaSource.slice(0, 7);
  const repositoryUrl = resolveRepositoryHttpUrl();
  const commitUrl =
    process.env.VITE_COMMIT_URL ??
    (repositoryUrl && fullSha !== "dev" ? `${repositoryUrl}/commit/${fullSha}` : "");
  const buildTimestamp = process.env.VITE_BUILD_TIMESTAMP ?? "";

  return {
    version,
    fullSha,
    shortSha,
    commitUrl,
    buildTimestamp,
  };
}

export default defineConfig(({ command }) => {
  const metadata = resolveBuildMetadata();

  return {
    base: command === "build" ? GITHUB_PAGES_BASE_PATH : "/",
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(metadata.version),
      "import.meta.env.VITE_COMMIT_SHA": JSON.stringify(metadata.fullSha),
      "import.meta.env.VITE_COMMIT_SHORT_SHA": JSON.stringify(metadata.shortSha),
      "import.meta.env.VITE_COMMIT_URL": JSON.stringify(metadata.commitUrl),
      "import.meta.env.VITE_BUILD_TIMESTAMP": JSON.stringify(metadata.buildTimestamp),
    },
    plugins: [
      react(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.ts",
        manifest: false,
        injectManifest: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,woff2}"],
          maximumFileSizeToCacheInBytes: APP_SHELL_CACHE_BUDGET_BYTES,
        },
      }),
    ],
  };
});
