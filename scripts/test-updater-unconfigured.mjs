import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { build } = createRequire(require.resolve("vite"))("esbuild");

globalThis.window = { __TAURI_INTERNALS__: {} };
globalThis.localStorage = {
  getItem: (key) => key === "harbor.settings" ? JSON.stringify({ betaUpdates: true }) : null,
  setItem: () => {},
};
async function bundle(entry, configured) {
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, format: "esm", platform: "node",
    define: { __APP_UPDATES_CONFIGURED__: String(configured), __APP_VERSION__: JSON.stringify("0.9.94") },
    plugins: [{
      name: "updater-test-host",
      setup(build) {
        build.onResolve({ filter: /^(react|@tauri-apps\/plugin-updater|@\/lib\/platform|@\/lib\/safe-fetch)$/ }, (args) => ({ path: args.path, namespace: "host" }));
        build.onLoad({ filter: /.*/, namespace: "host" }, ({ path }) => ({
          contents: path === "react"
            ? "export const useSyncExternalStore = (_subscribe, snapshot) => snapshot();"
            : path.includes("plugin-updater")
              ? "export const check = (...args) => globalThis.updaterTest.check(...args);"
              : path.includes("platform")
                ? "export const isMobileTauri = () => false; export const isWindowsDesktop = () => true; export const isMacDesktop = () => false;"
                : "export const safeFetch = (...args) => globalThis.updaterTest.fetch(...args);",
        }));
      },
    }],
  });
  return import("data:text/javascript;base64," + Buffer.from(result.outputFiles[0].text).toString("base64"));
}

for (const configured of [false, true]) {
  let checks = 0, intervals = 0, historyRequests = 0;
  globalThis.updaterTest = {
    check: async () => { checks++; return null; },
    fetch: async () => { historyRequests++; throw new Error("unexpected history request"); },
  };
  window.setInterval = () => { intervals++; return 1; };
  const updater = await bundle("src/lib/updater/use-update.ts", configured);
  await updater.checkForUpdate(false);
  await updater.checkForUpdate(true);
  updater.startUpdateWatcher();
  updater.startUpdateWatcher();
  await Promise.resolve();
  await updater.downloadUpdate();
  await updater.installUpdate();
  assert.equal(checks, configured ? 3 : 0, "no checks without a server; configured builds retain update support");
  assert.equal(intervals, configured ? 1 : 0, "no background timer without a server");
  if (!configured) {
    updater.openUpdatePanel();
    assert.equal(updater.useUpdate().panelOpen, false);
    assert.equal(updater.updateAvailable(updater.useUpdate()), false);
  }
  const history = await bundle("src/lib/updater/versions.ts", configured);
  assert.deepEqual(await history.fetchVersionHistory(), []);
  assert.equal(historyRequests, 0, "an empty history URL never fetches the old provider");
}
console.log("PASS: empty update configuration makes no checks, timers or history requests; future configured updates still work");

