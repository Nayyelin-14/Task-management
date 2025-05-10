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
      <div className="my-5">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row  md:items-center justify-between">
          <h2 className="text-xl font-medium">My Tasks</h2>

          {tabs?.[0]?.count > 0 && ( //all task mhr count ka 0 htk po mha
            <div className="flex items-center gap-4">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterKey}
                setActiveTab={setFilterKey}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
          {!loading && allTasks.length === 0 && (
            <div className="text-xl font-medium flex justify-center items-center h-screen">
              No task is assigned!!!
            </div>
          )}
          {allTasks.length > 0 &&
            allTasks?.map((item, index) => (
              <TaskCard
                key={index}
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
