import { Profiling } from "@/types/type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProcessBarChart = ({ arr }: { arr: Profiling[] }) => {
  // transform metrics into chart-friendly format
  const data = arr.map((item) => ({
    name: `PID ${item.pid}`, // label on X axis
    cpu: item.cpu.percentCPUUsage, // CPU usage %
    wakeups: item.cpu.idleWakeupsPerSecond, // idle wakeups
  }));

  return (
    <div className="-ml-8 " style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Two bars: CPU usage + wakeups */}
          <Bar dataKey="cpu" fill="#8884d8" name="CPU %" />
          <Bar dataKey="wakeups" fill="#82ca9d" name="Idle Wakeups" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProcessBarChart;
