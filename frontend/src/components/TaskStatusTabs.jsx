import React from "react";

const TaskStatusTabs = ({ tabs, setActiveTab, activeTab }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs?.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors duration-200
              ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isActive
                  ? "bg-white text-blue-500"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatusTabs;
