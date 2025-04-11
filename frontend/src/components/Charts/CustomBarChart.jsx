import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomBarChart = ({ data }) => {
  const getBarColors = (entry) => {
    switch (entry?.status) {
      case "Low":
        return "#00BC7D";
      case "Medium":
        return "#FE9900";
      case "High":
        return "#FF1F57";

      default:
        return "#00BC70";
    }
  };

  const CustomTooltips = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-medium text-purple-400 mb-1 ">
          {payload[0]?.payload?.status ?? "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-400">
            {payload[0]?.payload?.count ?? 0}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white mt-6 ">
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip
            content={<CustomTooltips />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="count" //Bar height is based on count value.
            //     fill="#FF8042"
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
            radius={[10, 10, 0, 0]}
          >
            {/* Then during .map():
1st loop: entry = { status: "Low", count: 10 }
2nd loop: entry = { status: "Medium", count: 20 }
3rd loop: entry = { status: "High", count: 5 } */}
            {data?.map((entry, index) => (
              <Cell
                key={`${entry.status}-${entry.count}-${index}`}
                fill={getBarColors(entry)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
