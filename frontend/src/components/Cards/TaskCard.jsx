import React from "react";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
const TaskCard = ({ item, onClick }) => {
  console.log(item);
  const attachmentsCount = item.attachments?.length || 0;
  const createdAt = item.createdAt;
  const description = item.description;
  const assignedTo = item.assignedTo?.map((user) => user.profileImageUrl);
  const dueDate = item.dueDate;
  const priority = item.priority;
  const progress = item.progress;
  const status = item.status;
  const title = item.title;
  const todoChecklist = item.todoChecklist?.length || 0;

  const getstatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-yellow-500   bg-yellow-200/50 border border-yellow-400";
      case "Pending":
        return "text-purple-500   bg-purple-200/50 border border-purple-400";
      case "Completed":
        return "text-green-500   bg-green-200/50 border border-green-400";
      default:
        return "text-gray-500   bg-gray-200/50 border border-gray-400";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/60";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/60";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/60";
    }
  };

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-200 border border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-4 px-4">
        <div
          className={`text-[14px] font-medium ${getstatusTagColor()} px-4 py-0.5 rounded-lg w-fit`}
        >
          {status}
        </div>
        <div
          className={`text-[14px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded-lg w-fit`}
        >
          {priority}
        </div>
      </div>
      <div
        className={`px-4 border-l-[4px] ${
          status === "In Progress"
            ? "border-yellow-500"
            : status === "Completed"
            ? "border-green-500"
            : "border-purple-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-900 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-sm font-medium text-gray-600 mt-4 line-clamp-2 leading-[18px]">
          {description}
        </p>
        <p className="text-[14px] text-gray-500 font-medium mt-2 mb-2 leading-[18px]">
          Task Done : <span>{}</span>
        </p>
        <Progress status={status} progress={progress} />
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between my-2">
          <div>
            <label htmlFor="" className="text-sm text-gray-700">
              Start Date
            </label>
            <p className="text-md text-gray-800">
              {moment(createdAt).format("Do MM YYYY")}
            </p>
          </div>
          <div>
            <label htmlFor="" className="text-sm text-red-700">
              Due Date
            </label>
            <p className="text-md text-gray-800">
              {moment(dueDate).format("Do MM YYYY")}
            </p>
          </div>
        </div>
      </div>
      {/* /// */}

      <div className="flex items-center justify-between mt-3 px-5">
        <AvatarGroup avatars={assignedTo || 0} />

        {attachmentsCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-200 px-2.5 py-2 rounded-lg">
            <LuPaperclip className="text-blue-700 " />

            <span className="text-sm font-medium text-gray-900">
              {attachmentsCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
