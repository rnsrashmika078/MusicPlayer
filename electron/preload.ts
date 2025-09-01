import { ipcRenderer, contextBridge } from "electron";
// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
});

contextBridge.exposeInMainWorld("electronAPI", {
  getMetadata: (filePath: string) =>
    ipcRenderer.invoke("get-metadata", filePath),
  getMetadataArray: (filePath: string[]) =>
    ipcRenderer.invoke("get-metadata-array", filePath),

  getMetrics: () => ipcRenderer.invoke("get-metrics"),

  //volume
  saveVolume: (level: number) => ipcRenderer.send("save-volume", level),
  getVolume: () => ipcRenderer.invoke("get-volume"),

  // shuffle
  saveShuffle: (state: boolean) => ipcRenderer.send("save-shuffle", state),
  getShuffle: () => ipcRenderer.invoke("get-shuffle"),

  // repeat
  saveRepeat: (state: boolean) => ipcRenderer.send("save-repeat", state),
  getRepeat: () => ipcRenderer.invoke("get-repeat"),

  // fullscreen
  toggleFullscreen: () => ipcRenderer.send("toggle-fullscreen"),

  // toggle mini player
  toggleMiniplayer: () => ipcRenderer.send("toggle-mini-player"),

  getProcessMemoryInfo: () => process.getProcessMemoryInfo(),

  // save and retrive current tab name
  saveTab: (tabName: boolean) => ipcRenderer.send("save-tab", tabName),
  getTab: () => ipcRenderer.invoke("get-tab"),
});
