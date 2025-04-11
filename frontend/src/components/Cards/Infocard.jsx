import React from "react";

const Infocard = ({ icon, value, color, label }) => {
  return (
    <div className="flex gap-3 items-center">
      <div className={`w-2 h-3 md:h-5 rounded-md ${color}`} />

      <p className="text-xs md:text-[14px] text-gray-500 flex items-center gap-1">
        <span className="text-sm md:text-[15px] text-black font-semibold">
          {value}{" "}
        </span>
        {label}
      </p>
    </div>
  );
};

export default Infocard;
