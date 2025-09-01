export interface metadata {
  title: string;
  artist: string;
  album: string;
  picture: string;
}
type Memory = {
  workingSetSize: number;
  peakWorkingSetSize: number;
  privateBytes: number;
};
type Cpu = {
  idleWakeupsPerSecond: number;
  percentCPUUsage: number;
};

export interface Profiling {
  cpu: Cpu;
  creationTime: number;
  integrityLevel: string;
  pid: number;
  memory: Memory;
  sandBoxed: boolean;
  type: string;
}

export interface CPUUsage {
  name: string;
  cpuusage: number;
  type: string;
}
export interface MemoryUsage {
  private: number;
  residentSet: number;
  shared: number;
}
