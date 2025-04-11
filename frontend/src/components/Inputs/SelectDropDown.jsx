import React, { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

const SelectDropDown = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectValue = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mt-4 ">
      <button
        className="flex  w-full items-center justify-between outline-none bg-white border border-gray-200 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : placeholder}

        <p>{isOpen ? <LuChevronDown /> : <LuChevronUp />}</p>
      </button>
      {isOpen && (
        <div className="border border-gray-200 absolute w-full  rounded-lg mt-1 shadow-md z-10 bg-white">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectValue(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-200"
            >
              {option.label}{" "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropDown;
