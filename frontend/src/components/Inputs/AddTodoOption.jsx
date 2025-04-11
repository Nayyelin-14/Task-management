import React, { useState } from "react";
import { HiOutlineTrash, HiPlus } from "react-icons/hi";

const AddTodoOption = ({ setTodoList, todoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updateTodoArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updateTodoArr);
  };

  return (
    <div
      className="mt-3
    "
    >
      {todoList &&
        todoList.map((item, index) => (
          <div className="flex items-center justify-between border border-gray-100  bg-blue-100/30 rounded-lg px-4 py-3 my-2 w-full md:w-[70%]">
            <p className="text-sm font-medium">
              <span>{index < 9 ? `0${index + 1} ` : index + 1}</span>

              {item}
            </p>

            <button onClick={() => handleDeleteOption(index)}>
              <HiOutlineTrash className="text-xl cursor-pointer text-red-400 hover:text-red-400/50" />
            </button>
          </div>
        ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter task"
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="w-full text-sm font-medium text-black outline-none bg-white border border-gray-200 p-2.5 rounded-lg"
        />

        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddTodoOption;
