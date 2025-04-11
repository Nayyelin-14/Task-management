import React from "react";
import { IoMdClose } from "react-icons/io";

const UserModel = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return;
  return (
    <section className="fixed  top-0 right-0 left-0 flex max-h-full h-[calc(100%-1rem)] items-center justify-center z-50 w-full bg-black/20 bg-opacity-50 overflow-x-hidden overflow-y-auto">
      <div className="relative p-4 w-full max-w-2xl  max-h-full ">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200  rounded-t dark:border-gray-600 ">
            <p className="text-lg font-medium text-gray-500 dark:text-white">
              {title}
            </p>

            <button onClick={onClose}>
              <IoMdClose className="text-gray-400 hover:text-black cursor-pointer w-6 h-6" />
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default UserModel;
