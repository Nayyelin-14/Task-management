import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const ManageTask = () => {
  const [allTask, setAllTask] = useState([]);
  const [filterKey, setFilterKey] = useState("All");

  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getAlltasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterKey === "All" ? "" : filterKey, //all so yiin filter m pr bo
        },
      });

      if (response.status === 200) {
        setAllTask(
          response?.data?.tasks?.length > 0 ? response?.data?.tasks : []
        );
        const statusSummary = response?.data?.statusSummary || {};

        const statusArray = [
          { label: "All", count: statusSummary.allTasks || 0 },
          { label: "Pending", count: statusSummary.pendingTasks || 0 },
          { label: "Completed", count: statusSummary.completedTasks || 0 },
          { label: "In progress", count: statusSummary.inprogressTasks || 0 },
        ];
        setTabs(statusArray);
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } }); //pass data to the new route (/admin/create-task) without it appearing in the URL itself.const location = useLocation();s // cosnst taskId = location.state?.taskId; // Access the taskId from the state//
  };

  const downloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_TASKS, {
        responseType: "blob",
      });
      3;
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "task_details.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Error downloading report");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error downloading report");
    }
  };

  useEffect(() => {
    getAlltasks();
    return () => {};
  }, [filterKey]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-3xl h-screen flex items-center justify-center">
          Loading data
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-2 w-full px-3 md:px-0 mx-auto overflow-x-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Title + Mobile Download */}
          <div className="flex items-center justify-between mb-2 lg:mb-0 w-full">
            <h2 className="text-lg font-medium truncate">Manage Tasks</h2>
            <button
              className="flex lg:hidden downloadBtn whitespace-nowrap"
              onClick={downloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>

          {/* Tabs + Desktop Download */}
          {tabs?.[0]?.count > 0 && (
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterKey}
                setActiveTab={setFilterKey}
              />
              <button
                className="hidden lg:flex downloadBtn whitespace-nowrap"
                onClick={downloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download report
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {allTask.length === 0 && (
          <div className="text-lg text-red-500 flex items-center justify-center mt-16 text-center px-4">
            No tasks found!
          </div>
        )}

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
          {allTask.length > 0 &&
            allTask.map((item, index) => (
              <TaskCard
                key={index}
                item={item}
                onClick={() => handleClick(item)}
              />
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTask;
