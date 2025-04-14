import React from "react";
import usericon from "./usericon.jpg";

const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card p-2">
      <div className="flex   flex-col">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl || usericon}
            alt={"Avatar"}
            className="w-12 h-12 rounded-full"
          />

          <div>
            <p className="text-sm font-medium ">{userInfo.name}</p>
            <p className="text-sm font-medium text-gray-600">
              {userInfo.email}
            </p>
          </div>
        </div>

        <div className="flex items-end gap-3 mt-5">
          <StatCards
            label="Pending"
            count={userInfo?.PendingTasks ?? 0}
            status="Pending"
          />{" "}
          <StatCards
            label="In Progress"
            count={userInfo?.InProgressTasks ?? 0}
            status="In Progress"
          />{" "}
          <StatCards
            label="Completed"
            count={userInfo?.CompletedTasks ?? 0}
            status="Completed"
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;

const StatCards = ({ label, count, status }) => {
  const getstatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-yellow-400/90   bg-yellow-100/30 border-l-4 border-yellow-300/50";
      case "Pending":
        return "text-purple-400/90   bg-purple-100/30 border-l-4 border-purple-300/50";
      case "Completed":
        return "text-green-400/90 bg-green-100/30 border-l-4 border-l-green-300/50";

      default:
        return "text-gray-400/90   bg-gray-100/30 border-l-4 border-gray-300/50";
    }
  };

  return (
    <div
      className={`flex-1 items-center gap-3  text-sm font-medium ${getstatusTagColor()} px-4 py-0.5 `}
    >
      <span>{count} </span> <br /> {label}
    </div>
  );
};
