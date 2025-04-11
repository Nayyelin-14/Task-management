import React from "react";

const TaskStatusTabs = ({ tabs, setActiveTab, activeTab }) => {
  return (
    <div className="flex">
      {tabs?.map((tab) => (
        <button
          className={`relative px-3 md:px-4 py-2 font-medium cursor-pointer hover:text-blue-300 hover:bg-gray-200 ${
            activeTab === tab.label
              ? "text-blue-400"
              : "text-gray-500 hover:text-gray-600"
          } `}
          onClick={() => setActiveTab(tab.label)}
        >
          <div className="flex items-center">
            <span className="text-sm">{tab.label}</span>
            <span
              className={`text-xs  ml-2 px-2 py-0.5 rounded-full ${
                activeTab === tab.label
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab.count}
            </span>
          </div>
          {activeTab === tab.label && (
            <div className="w-full h-0.5 absolute bg-blue-500 bottom-0 left-0 "></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;
