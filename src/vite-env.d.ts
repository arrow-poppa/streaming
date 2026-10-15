/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __APP_UPDATES_CONFIGURED__: boolean;
declare const __IS_BETA_BUILD__: boolean;

interface Window {
  __harborStremioDeeplink?: boolean;
  __harborInstallerOpen?: boolean;
}
