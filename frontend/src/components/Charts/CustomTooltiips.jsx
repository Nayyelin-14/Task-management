import React from "react";

const CustomTooltiips = ({ active, payload }) => {
  //         active: true when the user hovers over a chart element (like a slice).
  //   Recharts automatically injects the following props into your custom tooltip component:
  // payload: an array containing data about the hovered item (e.g., status, count, etc.).

  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-medium text-purple-400 mb-1 ">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600">
          Count :{" "}
          <span className="text-sm font-medium text-gray-400">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
};

export default CustomTooltiips;
