import { MemoryUsage, metadata } from "./types/type";

export {};

declare global {
  interface Window {
    electronAPI: {
      getMetadata: (filePath: string) => Promise<metadata>;
      getMetadataArray: (filePath: string[]) => Promise<metadata[]>;
      getMetrics: () => Promise<any>;
      saveVolume: (level: number) => void;
      getVolume: () => Promise<number>;
      saveShuffle: (state: boolean) => void;
      getShuffle: () => Promise<boolean>;
      saveRepeat: (state: boolean) => void;
      getRepeat: () => Promise<boolean>;
      toggleFullscreen: () => Promise<boolean>;
      toggleMiniplayer: () => Promise<boolean>;
      saveTab: (tabName: string) => void;
      getTab: () => Promise<string>;
      getProcessMemoryInfo: () => MemoryUsage;
    };
  }
}
