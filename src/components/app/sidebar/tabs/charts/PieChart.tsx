import { Profiling } from "@/types/type";
import { PieChart as PIECHART, Pie, Tooltip, Cell } from "recharts";

const PieChart = ({ arr }: { arr: Profiling[] }) => {
  const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 200 },
    { name: "May", value: 600 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];
  return (
    <PIECHART width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PIECHART>
  );
};

export default PieChart;
