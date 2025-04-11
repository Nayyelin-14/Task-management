import React from "react";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltiips from "./CustomTooltiips";
import CustomLegend from "./CustomLegend";
const CustomPieChart = ({ data, label, colors }) => {
  console.log(data);
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="count"
            data={data}
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={100}
            labelLine={false}
          >
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </Pie>
          <Tooltip content={<CustomTooltiips />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
