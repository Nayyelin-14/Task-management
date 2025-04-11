import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuTrash2 } from "react-icons/lu";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropDown from "../../components/Inputs/SelectDropDown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import AddTodoOption from "../../components/Inputs/AddTodoOption";
import AddAttachments from "../../components/Inputs/AddAttachments";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    attachments: [],
    assignedTo: [],
    priority: "Low",
    dueDate: null,
    todoChecklists: [],
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const handleValueChange = (key, value) => {
    setTaskData((prevTask) => ({ ...prevTask, [key]: value }));
  };

  const clearTaskData = () => {
    //resetData
    setTaskData({
      title: "",
      description: "",
      attachments: [],
      assignedTo: [],
      priority: "Low",
      dueDate: null,
      todoChecklists: [],
    });
  };
  const removeTask = () => {};
  const updateTask = () => {};
  const createTask = async () => {
    try {
      const setEachTodolist = taskData.todoChecklists?.map((checklist) => ({
        text: checklist,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        todoChecklist: setEachTodolist,
        dueDate: new Date(taskData.dueDate).toISOString(),
      });
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      clearTaskData();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };
  const handleSubmit = () => {
    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!taskData.dueDate) {
      setError("Due Date is required");
      return;
    }

    if (taskData.assignedTo.length === 0) {
      setError("Assign member is required");
      return;
    }
    if (!taskData.priority) {
      setError("Priority is needed to be set");
      return;
    }
    if (taskData.todoChecklists.length === 0) {
      setError("Chechlist is required");
      return;
    }
    setError("");
    if (taskId) {
      updateTask();
    }
    if (!error && !taskId) {
      createTask();
    }
  };
  const getTaskDetailsById = () => {};

  return (
    <DashboardLayout activeMenu="Create Task">
      <section className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {/* ///form/ */}
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <p>{taskId ? "Update Task Data" : "Create new Task"}</p>

              {!taskId && (
                <button
                  onClick={() => setOpenDeleteAlert(true)}
                  className="delete-btn"
                >
                  <LuTrash2 />
                </button>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="title" className="form-label">
                Task Title
              </label>
              <input
                placeholder="Create App Ui"
                value={taskData.title}
                type="text"
                className="form-input"
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="title" className="form-label">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                value={taskData.description}
                type="text"
                rows={4}
                className="form-input"
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <label htmlFor="priority" className="form-label">
                  Priority
                </label>
                <SelectDropDown
                  value={taskData.priority}
                  options={PRIORITY_DATA}
                  onChange={(option) => handleValueChange("priority", option)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label htmlFor="due date" className="form-label">
                  Set due date
                </label>
                <input
                  type="date"
                  placeholder="select due date"
                  className="form-input cursor-pointer"
                  value={taskData.dueDate || ""}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label htmlFor="due date" className="form-label">
                  Assign member
                </label>

                <SelectUsers
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                  selectedUsers={taskData.assignedTo}
                />
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="checklist" className="form-label">
                Todo checklist
              </label>
              <AddTodoOption
                todoList={taskData.todoChecklists}
                setTodoList={(value) =>
                  handleValueChange("todoChecklists", value)
                }
              />
            </div>

            <div className="mt-3">
              <label htmlFor="checklist" className="form-label">
                Attachments
              </label>
              <AddAttachments
                attachments={taskData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm font-medium my-5">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              className="mt-5  flex items-center justify-center border border-gray-100 w-full p-2 bg-blue-500/70 rounded-xl text-white font-bold hover:bg-blue-500/20"
            >
              {taskId ? "Update task" : "Create a new task"}
            </button>
          </div>
          {/* //form */}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CreateTask;
