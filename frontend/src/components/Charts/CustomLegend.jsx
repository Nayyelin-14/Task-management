import React from "react";

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-[20px] space-x-6 ">
      {payload?.map((entry, index) => (
        <div key={`Lengend - ${index}`} className="flex items-center space-x-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-md  font-medium" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
