import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskCard from "../../components/Cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);

  const [filterKey, setFilterKey] = useState("All");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const getAlltasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: { status: filterKey === "All" ? "" : filterKey },
      });

      if (response.status === 200) {
        setAllTasks(
          response?.data?.tasks?.length > 0 ? response?.data?.tasks : []
        );
        const statusSummary = response?.data?.statusSummary;
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
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlltasks();
  }, [filterKey]);

  const handleClick = (taskId) => {
    navigate(`/user/user-detailtask/${taskId}`);
  };
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-xl font-medium flex justify-center items-center h-screen">
          Loading data....
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout activeMenu="Tasks">
      <div className="my-5 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-medium">My Tasks</h2>

          {tabs?.[0]?.count > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-4">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterKey}
                setActiveTab={setFilterKey}
              />
            </div>
          )}
        </div>

        {!loading && allTasks.length === 0 && (
          <div className="text-xl font-medium flex justify-center items-center h-64 md:h-screen mt-10">
            No task is assigned!!!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 my-5">
          {allTasks.length > 0 &&
            allTasks.map((item) => (
              <TaskCard
                key={item._id}
                item={item}
                onClick={() => handleClick(item._id)}
              />
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
