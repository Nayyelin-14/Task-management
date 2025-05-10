import React from "react";

const Progress = ({ progress, status }) => {
  console.log(progress);
  const getColor = () => {
    switch (status) {
      case "In Progress":
        return "text-yellow-700   bg-yellow-500/50 border border-yellow-300";
      case "Pending":
        return "text-purple-700   bg-purple-500/50 border border-purple-300";
      case "Completed":
        return "text-green-700   bg-green-500/50 border border-green-300";
      default:
        return "text-gray-700   bg-gray-500/50 border border-gray-300";
    }
  };
  return (
    <div className="bg-gray-300 rounded-full h-2 flex justify-between ">
      <div
        className={`w-full ${getColor} h-2  rounded-full text-center text-xs font-medium `}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default Progress;
