/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_FIREBASE_VAPID_KEY: string;
  readonly VITE_MESSAGING_API_URL?: string;
  readonly VITE_MESSAGING_API_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
