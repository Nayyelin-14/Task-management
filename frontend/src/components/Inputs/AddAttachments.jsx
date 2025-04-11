import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";

const AddAttachments = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updateAttachArr = attachments.filter((_, ata) => ata !== index);
    setAttachments(updateAttachArr);
  };
  return (
    <div>
      {attachments &&
        attachments.map((item, index) => (
          <div className="flex items-center justify-between border border-gray-100  bg-blue-100/30 rounded-lg px-4 py-3 my-2 w-full md:w-[70%]">
            <p className="text-sm font-medium">
              <span>{index < 9 ? `0${index + 1} ` : index}</span>
              {item}
            </p>
            <button onClick={() => handleDeleteOption(index)}>
              <LuTrash2 className="text-red-400 hover:text-red-400/40 text-xl cursor-pointer" />
            </button>
          </div>
        ))}

      <div className="flex items-center justify-between gap-3">
        <input
          placeholder="Add attachment"
          type="text"
          className="p-2 mt-3 w-full border-gray-200 border rounded-lg text-sm font-medium outline-none"
          value={option}
          onChange={(e) => setOption(e.target.value)}
        />
        <button className="card-btn text-nowrap " onClick={handleAddOption}>
          <HiPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachments;
