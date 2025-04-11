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

  const downloadReport = () => {};

  useEffect(() => {
    getAlltasks();
    return () => {};
  }, [filterKey]);

  // if (loading) {
  //   return (
  //     <DashboardLayout>
  //       <div className="text-3xl h-screen flex items-center justify-center">
  //         Loading data
  //       </div>
  //     </DashboardLayout>
  //   );
  // }
  return (
    <DashboardLayout>
      <div className="my-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between mb-4 lg:mb-0">
            <h2 className="text-xl font-medium">Manage Tasks</h2>
            <button className="flex  lg:hidden downloadBtn ">
              <LuFileSpreadsheet className="text-lg" />
              Download report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && ( //all task mhr count ka 0 htk po mha
            <div className="flex items-center gap-4">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterKey}
                setActiveTab={setFilterKey}
              />
              <button className="lg:flex  hidden downloadBtn ">
                <LuFileSpreadsheet className="text-lg" />
                Download report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-col-3 my-5">
          {allTask?.map((item, index) => (
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
