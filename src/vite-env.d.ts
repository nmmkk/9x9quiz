/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_COMMIT_SHA: string;
  readonly VITE_COMMIT_SHORT_SHA: string;
  readonly VITE_COMMIT_URL: string;
  readonly VITE_BUILD_TIMESTAMP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
