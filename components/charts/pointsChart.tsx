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
import { FunctionComponent } from "react";

interface BarChartProps {
  names: Array<string>;
  points: Array<number>;
  height: number;
  width: number;
}

interface TooltipProps {
  active: boolean | undefined;
  payload: Array<any> | undefined;
  label: string | undefined;
}

const ParticipantChart: FunctionComponent<BarChartProps> = ({
  names,
  points,
  height,
  width,
}) => {
  // Combine the names and points into chartData
  let chartData = names.map((name, index) => ({
    name,
    points: points[index],
  }));

  // Sort chartData by points in descending order
  chartData.sort((a, b) => b.points - a.points);

  // Custom Tooltip
  const CustomTooltip = (props: TooltipProps) => {
    if (props.active && props.payload && props.payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <p className="label">{`${props.label} : ${props.payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis dataKey="name" tick={{ fill: "grey" }} axisLine={false} />
        <YAxis
          tickFormatter={(tick) => `${tick}`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.1)" }}
        />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
        <Bar
          dataKey="points"
          name="Normalized Points"
          fill="#ff4d4f"
          radius={[10, 10, 0, 0]}
          barSize={20}
          animationBegin={200}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ParticipantChart;
