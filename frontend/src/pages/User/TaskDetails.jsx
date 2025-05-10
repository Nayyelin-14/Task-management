import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

const TaskDetails = () => {
  const [task, setTask] = useState([]);
  const { taskId } = useParams();
  const getColor = () => {
    switch (task.status) {
      case "In Progress":
        return "text-yellow-700   bg-yellow-500/50 border border-yellow-300";
      case "Pending":
        return "text-purple-700   bg-purple-500/50 border border-purple-300";
      case "Completed":
        return "text-green-700   bg-green-500/50 border border-green-300";
      default:
        return "text-gray-700   bg-gray-500/50 border border-gray-300";
    }
  };
  const getTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.status === 200) {
        const taskInfo = response.data;

        setTask(taskInfo);
      } else {
        console.log(response);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodoCheckList = async (index) => {
    const todoCheckList = [...task?.todoChecklist];

    // Make sure the item exists at the index
    if (todoCheckList && todoCheckList[index]) {
      // Toggle the completed status
      todoCheckList[index].completed = !todoCheckList[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), // ✅ Use taskId from useParams
          { todoChecklist: todoCheckList } // ✅ Correct key
        );
        console.log(response);
        if (response.status === 200) {
          setTask(response?.data?.updatedTask || task);
        } else {
          // Revert the change if the request fails
          todoCheckList[index].completed = !todoCheckList[index].completed;
        }
      } catch (error) {
        // Revert the change if the request fails
        todoCheckList[index].completed = !todoCheckList[index].completed;
      }
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (typeof taskId === "string" || typeof taskId === "number") {
      getTaskDetails();
    }
  }, [taskId, task]);

  return (
    <DashboardLayout activeMenu="Tasks">
      <div className="my-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4 ">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">{task?.title}</h2>
                <div
                  className={`text-sm font-medium ${getColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("Do MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assinged To
                  </label>
                  <AvatarGroup
                    maxVisible={5}
                    avatars={
                      task?.assignedTo?.map((user) => user?.profileImageUrl) ||
                      []
                    }
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo CheckLists
                </label>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoChecklist
                    key={`todo-_${index}`}
                    isChecked={item?.completed}
                    text={item?.text}
                    onChange={() => updateTodoCheckList(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachments
                      key={`link_${index}`}
                      index={index}
                      link={link}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="text-[12px]  md:text-[13px] font-medium text-gray-700  my-1">
        {value}
      </p>
    </>
  );
};

const TodoChecklist = ({ isChecked, text, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="border-gray-300 rounded-sm outline-none cursor-pointer text-blue-500 bg-gray-100 w-4 h-4"
      />
      <p className="text-[12px]  md:text-[13px] font-medium text-gray-700  my-1">
        {text}
      </p>
    </div>
  );
};

const Attachments = ({ link, onClick, index }) => {
  return (
    <div
      className="flex justify-between gap-4 mt-4 bg-gray-100 px-3 py-2 rounded-lg"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3 ">
        <span className="text-xs text-gray-500 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>
        <p className="text-[12px]  md:text-[13px] font-medium text-gray-700  my-1">
          {link}
        </p>
      </div>
      <LuSquareArrowOutUpRight className="text-gray-600 cursor-pointer hover:text-gray-900" />
    </div>
  );
};
