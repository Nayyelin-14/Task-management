import React from "react";
import moment from "moment";
// purple, yellow,green,blue
const TaskListTable = ({ tableData }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-400 border border-green-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-400 border border-yellow-200";
      case "Pending":
        return "bg-purple-100 text-purple-400 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-400 border border-gray-200";
    }
  };
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-400 border border-green-200";
      case "High":
        return "bg-red-100 text-red-400 border border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-400 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-400 border border-gray-200";
    }
  };
  console.log(tableData);
  return (
    <div className="overflow-x-auto p-0 rounded-lg ">
      <table className="min-w-full ">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-3 text-gray-800 font-medium text-[13px]">
              Name
            </th>
            <th className="py-3 px-3 text-gray-800 font-medium text-[13px]">
              Status
            </th>
            <th className="py-3 px-3 text-gray-800 font-medium text-[13px]">
              Priority
            </th>
            <th className="py-3 px-3 text-gray-800 font-medium text-[13px] hidden md:table-cell">
              Created at
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((item) => {
              return (
                <tr key={item._id} className="border-t border-gray-300">
                  <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                    {item.title}
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md inline-block ${getStatusBadgeColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    {" "}
                    <span
                      className={`px-2 py-1 text-xs rounded-md inline-block ${getPriorityBadgeColor(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                    <span className="text-xs">
                      {" "}
                      {item.createdAt
                        ? moment(item.createdAt).format("Do MM YYYY")
                        : "N/A"}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
