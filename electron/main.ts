import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseFile } from "music-metadata";
import { UserPreference } from "./storage";
import { screen } from "electron";
import Store from "electron-store";
import { metadata } from "@/types/type";

const store = new Store();

createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let mainWin: BrowserWindow | null;
let dockWin: BrowserWindow | null;

function createDockWindow() {
  if (dockWin) return; // 👈 prevent multiple creations

  dockWin = new BrowserWindow({
    width: 640,
    height: 640,
    minWidth: 640,
    minHeight: 640,
    parent: mainWin ?? undefined,
    title: "Dock Window",
    minimizable: false,
    maximizable: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    resizable: true,
    show: false, // 👈 start hidden
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  if (VITE_DEV_SERVER_URL) {
    dockWin.loadURL(VITE_DEV_SERVER_URL + "/dock");
  } else {
    dockWin.loadFile(path.join(RENDERER_DIST, "dock.html"));
  }

  // optional: set null when closed completely
  dockWin.on("closed", () => {
    dockWin = null;
  });
}

// ipc for toggle full screen
ipcMain.on("toggle-mini-player", () => {
  if (!dockWin) {
    createDockWindow(); // create only once
  }

  if (dockWin?.isVisible()) {
    dockWin.hide(); // 👈 just hide
  } else {
    dockWin?.show(); // 👈 show again
  }
});

function createWindow() {
  mainWin = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      //   devTools: false,
    },
    minWidth: 640,
    minHeight: 640,
    resizable: true,
    autoHideMenuBar: true,
  });

  // Test active push message to Renderer-process.
  mainWin.webContents.on("did-finish-load", () => {
    mainWin?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    mainWin.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWin.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // get metrics
  ipcMain.handle("get-metrics", () => {
    return app.getAppMetrics();
  });
}

// ipc for toggle full screen

ipcMain.handle("get-metadata", async (_event, filePath: string) => {
  try {
    const metadata = await parseFile(filePath);
    let pictureDataUrl = null;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0]; // first image
      const base64String = Buffer.from(picture.data).toString("base64");
      pictureDataUrl = `data:${picture.format};base64,${base64String}`;
    }
    return {
      title: metadata.common.title,
      artist: metadata.common.artist,
      album: metadata.common.album,
      picture: pictureDataUrl, // Array of images
    };
  } catch (err) {
    return { error: err instanceof Error && err.message };
  }
});
ipcMain.handle("get-metadata-array", async (_event, filePath: string[]) => {
  try {
    const metaDataArray = await Promise.all(
      filePath.map((item) => parseFile(item))
    );
    const results = metaDataArray.map((element) => {
      let pictureDataUrl = null;

      if (element.common.picture && element.common.picture.length > 0) {
        const picture = element.common.picture[0]; // first image
        const base64String = Buffer.from(picture.data).toString("base64");
        pictureDataUrl = `data:${picture.format};base64,${base64String}`;
      }
      return {
        title: element.common.title,
        artist: element.common.artist,
        album: element.common.album,
        picture: pictureDataUrl,
      };
    });

    return results;
  } catch (err) {
    return { error: err instanceof Error && err.message };
  }
});

// user preference call
UserPreference();

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWin = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
});
