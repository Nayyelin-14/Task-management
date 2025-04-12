import React from "react";

const ConfirmModel = ({ onConfirmDelete, content }) => {
  return (
    <div>
      <p className="flex flex-wrap w-[80%] text-sm font-semibold text-gray-600">
        {content}
      </p>
      <div className="flex items-center justify-end mt-4">
        <button
          className="border p-2 border-gray-400/30 text-sm text-red-500  rounded-lg  hover:bg-red-700/60 cursor-pointer hover:text-white"
          onClick={onConfirmDelete}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmModel;
