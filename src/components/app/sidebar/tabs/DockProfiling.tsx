import Button from "@/components/Common/Button";
import { MemoryUsage, Profiling } from "@/types/type";
import { useActiveTab, useMusicPlayerStore } from "@/zustand/store";
import { useEffect, useState } from "react";
import ProgressCircle from "./charts/ProgressCircle";
import PieChart from "./charts/PieChart";
import ProcessBarChart from "./charts/ProcessBarChart";
import LineCharts from "./charts/LineChart";
import { DockIcon } from "lucide-react";

const DockProfiling = ({ searchVal }: { searchVal: string | undefined }) => {
  const tab = useActiveTab((store) => store.tab);
  const [arr, setArr] = useState<Profiling[]>([]);
  const height = useMusicPlayerStore((store) => store.height);
  const memoryUsage = useMusicPlayerStore((store) => store.memoryUsage);
  console.log("Private:", memoryUsage.private);
 

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.electronAPI.getMetrics().then((v) => setArr(v));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [arr]);

  const data = arr.map((item) => ({
    name: `PID ${item.pid}`,
    type: item.type,
    cpuusage: item.cpu.percentCPUUsage, // CPU usage %
  }));

  return (
    <div className="relative ">
      <div
        className={`bg-white border-b  border-gray-200 flex justify-between items-center mx-2 mt-2 sticky top-0`}
      >
        <h1 className="font-bold text-3xl mb-1 mt-1 ">{"Settings"}</h1>
        <Button
          name="Dock"
          variant="windows"
          radius="md"
          size="xs"
          onClick={() => window.electronAPI.toggleMiniplayer()}
        >
          <DockIcon size={15} />
        </Button>
      </div>
      <div
        className="justify-center items-center  overflow-y-auto h-screen space-y-2  mt-2 bg-white z-[9998]"
        style={{ height: height - 250 }}
      >
        <h1 className=" mx-2 rounded-l-full text-white text-xs   overflow-y-auto font-bold p-2 bg-gradient-to-l from-black via-slate-600 to-red-500">
          CPU Usage - Each Process
        </h1>
        <div className="z-[9999] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4  mt-2">
          {[...Array(arr.length)].map((_c, i) => (
            // @ts-ignore
            <div key={i} className="px-5 ">
              <ProgressCircle purpose="CPUUsage" cpuProperty={data[i]} />
            </div>
          ))}
        </div>
        <h1 className="mx-2 rounded-l-full text-white text-xs   overflow-y-auto font-bold p-2 bg-gradient-to-l from-black via-slate-600 to-red-500">
          Memory Usage
        </h1>
        <div className="px-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4  mt-2">
          {/* @ts-ignore */}
          <ProgressCircle
            purpose="MEMORYUsage"
            memoryPropety={memoryUsage?.private}
            propertyName={"App Size in Memory"}
          />
          <ProgressCircle
            purpose="MEMORYUsage"
            memoryPropety={memoryUsage?.residentSet}
            propertyName={"Current Usage"}
          />
          <ProgressCircle
            purpose="MEMORYUsage"
            memoryPropety={memoryUsage?.shared}
            propertyName={"Shared Memory (Lib usage)"}
          />
        </div>
        {/* <ProcessBarChart arr={arr} /> */}
      </div>
    </div>
  );
};

export default DockProfiling;
