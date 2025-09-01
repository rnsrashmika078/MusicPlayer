"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  getMetadata: (filePath) => electron.ipcRenderer.invoke("get-metadata", filePath),
  getMetadataArray: (filePath) => electron.ipcRenderer.invoke("get-metadata-array", filePath),
  getMetrics: () => electron.ipcRenderer.invoke("get-metrics"),
  //volume
  saveVolume: (level) => electron.ipcRenderer.send("save-volume", level),
  getVolume: () => electron.ipcRenderer.invoke("get-volume"),
  // shuffle
  saveShuffle: (state) => electron.ipcRenderer.send("save-shuffle", state),
  getShuffle: () => electron.ipcRenderer.invoke("get-shuffle"),
  // repeat
  saveRepeat: (state) => electron.ipcRenderer.send("save-repeat", state),
  getRepeat: () => electron.ipcRenderer.invoke("get-repeat"),
  // fullscreen
  toggleFullscreen: () => electron.ipcRenderer.send("toggle-fullscreen"),
  // toggle mini player
  toggleMiniplayer: () => electron.ipcRenderer.send("toggle-mini-player"),
  getProcessMemoryInfo: () => process.getProcessMemoryInfo(),
  // save and retrive current tab name
  saveTab: (tabName) => electron.ipcRenderer.send("save-tab", tabName),
  getTab: () => electron.ipcRenderer.invoke("get-tab")
});
