import Store from "electron-store";
import { ipcMain } from "electron";

const store = new Store();

export function UserPreference() {
  // save volume level in storage// volume level
  ipcMain.on("save-volume", (_event, level) => {
    store.set("volume", level);
  });
  ipcMain.handle("get-volume", () => {
    return store.get("volume", 1.0);
  });

  // save shuffle  level in storage

  ipcMain.on("save-shuffle", (_event, state) => {
    store.set("shuffle", state);
  });

  ipcMain.handle("get-shuffle", () => {
    return store.get("shuffle", false);
  });

  // save repeat level in storage
  ipcMain.on("save-repeat", (_event, state) => {
    return store.set("repeat", state);
  });
  ipcMain.handle("get-repeat", () => {
    return store.get("repeat", false);
  });
  // save current tab in storage
  ipcMain.on("save-tab", (_event, tabName) => {
    return store.set("tab", tabName);
  });
  ipcMain.handle("get-tab", () => {
    return store.get("tab", "Home");
  });
}
