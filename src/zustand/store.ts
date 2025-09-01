import { MemoryUsage, metadata } from "@/types/type";
import { create } from "zustand";
type ElapsedTime = { minutes: number; seconds: number };
type ControlsStore = {
  isRepeatOn: boolean;
  isPause: boolean;
  isShuffleOn: boolean;
  isVolumeBarOpen: boolean;
  currentSong: File | null;
  songDuration: number;
  currentTime: number;
  elapsedTime: ElapsedTime;
  seekPosition: number;
  volumeLevel: number;
  timeLength: ElapsedTime;
  audioRef: HTMLAudioElement | null;
  finishedPlay: boolean;
  currentId: number;
  files: File[];
  toggleMiniplayer: boolean;
  metaData: metadata | undefined;
  height: number;
  memoryUsage: MemoryUsage;
  setIsPause: () => void;
  setIsRepeatOn: (state: boolean) => void;
  setIsShuffleOn: (state: boolean) => void;
  setCurrentPlayingSong: (song: File) => void;
  setSongDuration: (duration: number) => void;
  setElapsedTime: (elapsedTime: ElapsedTime) => void;
  setCurrentTime: (current: number) => void;
  setIsVolumeBarOpen: () => void;
  setSeekPosition: (position: number) => void;
  setVolumeLevel: (volumeLevel: number) => void;
  setTimeLength: (timeLength: ElapsedTime) => void;
  setAudioRef: (audioRef: HTMLAudioElement) => void;
  setFinishedPlay: (finished: boolean) => void;
  setFiles: (files: File[]) => void;
  setCurrentId: (idx: number) => void;
  setToggleMiniPlayer: (condition: boolean) => void;
  setMetadata: (metadata: metadata) => void;
  setHeight: (height: number) => void;
  setMemoryUsage: (data: MemoryUsage) => void;
};
type ActiveTabStore = {
  tab: string;
  setActiveTab: (tab: string) => void;
};

export const useMusicPlayerStore = create<ControlsStore>((set) => ({
  isRepeatOn: false,
  isPause: false,
  isShuffleOn: false,
  isVolumeBarOpen: false,
  currentSong: null,
  songDuration: 0,
  currentTime: 0,
  seekPosition: 0,
  volumeLevel: 0,
  toggleMiniplayer: false,
  audioRef: null,
  timeLength: { minutes: 0, seconds: 0 },
  elapsedTime: { minutes: 0, seconds: 0 },
  finishedPlay: false,
  files: [],
  metaData: undefined,
  currentId: 0,
  height: 0,
  memoryUsage: { private: 0, residentSet: 0, shared: 0 },
  setHeight: (height) => set(() => ({ height })),
  setIsPause: () => set((state) => ({ isPause: !state.isPause })),
  setIsRepeatOn: (state) => set(() => ({ isRepeatOn: state })),
  setIsShuffleOn: (state) => set(() => ({ isShuffleOn: state })),
  setCurrentPlayingSong: (song) => set(() => ({ currentSong: song })),
  setSongDuration: (songDuration) => set(() => ({ songDuration })),
  setCurrentTime: (currentTime) => set(() => ({ currentTime })),
  setIsVolumeBarOpen: () =>
    set((state) => ({ isVolumeBarOpen: !state.isVolumeBarOpen })),
  setElapsedTime: (elapsedTime) => set(() => ({ elapsedTime })),
  setSeekPosition: (position) => set(() => ({ seekPosition: position })),
  setVolumeLevel: (level) => set(() => ({ volumeLevel: level })),
  setTimeLength: (timeLength) => set(() => ({ timeLength })),
  setAudioRef: (ref) => set(() => ({ audioRef: ref })),
  setFinishedPlay: (finished) => set(() => ({ finishedPlay: finished })),
  setFiles: (files) => set(() => ({ files })),
  setCurrentId: (idx) => set(() => ({ currentId: idx })),
  setToggleMiniPlayer: (condition) =>
    set(() => ({ toggleMiniplayer: condition })),
  setMetadata: (metaData) => set(() => ({ metaData })),
  setMemoryUsage: (memoryUsage) => set(() => ({ memoryUsage })),
}));

export const useActiveTab = create<ActiveTabStore>((set) => ({
  tab: "Home",
  setActiveTab: (tab) => set({ tab }),
}));
