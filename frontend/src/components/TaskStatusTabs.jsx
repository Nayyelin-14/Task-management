import React from "react";

const TaskStatusTabs = ({ tabs, setActiveTab, activeTab }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {" "}
      {/* Wrap on small screens */}
      {tabs?.map((tab) => (
        <button
          key={tab.label}
          className={`relative px-3 md:px-4 py-2 font-medium cursor-pointer rounded-md hover:bg-gray-200 transition-all duration-200 ${
            activeTab === tab.label ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab(tab.label)}
        >
          <div className="flex items-center">
            <span className="text-sm">{tab.label}</span>
            <span
              className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                activeTab === tab.label
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab.count}
            </span>
          </div>
          {activeTab === tab.label && (
            <div className="w-full h-0.5 absolute bg-blue-500 bottom-0 left-0"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;
