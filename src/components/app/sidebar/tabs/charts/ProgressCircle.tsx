import { CPUUsage } from "@/types/type";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

export default function ProgressCircle({
  cpuProperty,
  purpose,
  memoryPropety,
  propertyName,
}: {
  cpuProperty?: CPUUsage;
  purpose: string;
  memoryPropety?: number;
  propertyName?: string;
}) {
  const cpudata = cpuProperty && [
    { name: "Pid", value: cpuProperty.cpuusage },
    { usage: "Cpu Usage", value: 100 - cpuProperty.cpuusage },
  ];

  const memoryData = memoryPropety
    ? [
        { name: "Used", value: parseFloat((memoryPropety / 1024).toFixed(2)) },
        {
          name: "Free",
          value: parseFloat((16000 - memoryPropety / 1024).toFixed(2)),
        },
      ]
    : [];

  return (
    <div className=" relative flex flex-col justify-center items-center bg-gray-200">
      <div className="absolute z-20 text-center flex flex-col justify-center items-center">
        {cpuProperty && purpose.startsWith("CPU") ? (
          <>
            <h1>{cpuProperty.name}</h1>
            <p>{cpuProperty.cpuusage.toFixed(2)}%</p>
          </>
        ) : (
          <>
            <p>{memoryPropety && (memoryPropety / 1024).toFixed(2)} MB</p>
          </>
        )}
        <p>{cpuProperty && cpuProperty.type}</p>
      </div>
      <PieChart
        className="flex justify-center items-center"
        width={150}
        height={150}
      >
        <Pie
          data={purpose.startsWith("CPU") ? cpudata : memoryData}
          dataKey="value"
          startAngle={90}
          endAngle={-270} // full circle
          innerRadius={50}
          outerRadius={70}
          stroke="none"
        >
          <Cell fill="#8884d8" />
          <Cell fill="#e0e0e0" />
        </Pie>
      </PieChart>
      <div>
        {!purpose.startsWith("CPU") && <div className="">{propertyName}</div>}
      </div>
    </div>
  );
}
