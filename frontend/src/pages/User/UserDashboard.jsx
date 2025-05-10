import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import useUserAuth from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { IoMdCard } from "react-icons/io";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import Infocard from "../../components/Cards/Infocard";
import { addThousandSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/Tables/TaskListTable";
import { useNavigate } from "react-router-dom";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import { toast } from "react-toastify";
//for chartD
const COLORS = ["#8B5CF6 ", "#22C55E", "#FACC15"];

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [piechartdata, setPiechartdata] = useState([]);
  const [barchartdata, setBarchartdata] = useState([]);

  const getuserdataDashboard = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      console.log(response);
      if (response.data) {
        setDashboardData(response.data || null);
        getChartData(response.data.charts || null);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getuserdataDashboard();
  }, []);

  const Seemore = () => {
    navigate("/admin/tasks");
  };

  const getChartData = (chartdata) => {
    // console.log("hi", chartdata);
    const taskDistribution = chartdata?.taskDistribution || null;
    const priorityDistribution = chartdata?.taskPrioritesLevel || null;

    const taskDistributionData = [
      {
        status: "Pending",
        count: taskDistribution.Pending || 0,
      },
      {
        status: "Completed",
        count: taskDistribution.Completed || 0,
      },
      {
        status: "Inprogress",
        count: taskDistribution.Inprogress || 0,
      },
    ];

    setPiechartdata(taskDistributionData);
    const priorityDistributionData = [
      {
        status: "High",
        count: priorityDistribution.High || 0,
      },
      {
        status: "Low",
        count: priorityDistribution.Low || 0,
      },
      {
        status: "Medium",
        count: priorityDistribution.Medium || 0,
      },
    ];
    setBarchartdata(priorityDistributionData);
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5 ">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-10 mt-7">
          <Infocard
            icon={<IoMdCard />}
            value={
              addThousandSeparator(
                dashboardData?.charts?.taskDistribution?.All
              ) || 0
            }
            label={"All tasks"}
            color="bg-blue-400"
          />
          <Infocard
            icon={<IoMdCard />}
            value={
              addThousandSeparator(
                dashboardData?.charts?.taskDistribution?.Pending
              ) || 0
            }
            label={"Pending tasks"}
            color="bg-purple-400"
          />
          <Infocard
            icon={<IoMdCard />}
            value={
              addThousandSeparator(
                dashboardData?.charts?.taskDistribution?.Inprogress
              ) || 0
            }
            label={"InProgress tasks"}
            color="bg-yellow-400"
          />
          <Infocard
            icon={<IoMdCard />}
            value={
              addThousandSeparator(
                dashboardData?.charts?.taskDistribution?.Completed
              ) || 0
            }
            label={"Completed tasks"}
            color="bg-green-400"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center my-10 ">
        <div className="w-full md:w-[50%]">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart
              data={piechartdata}
              label="Total Balance"
              colors={COLORS}
            />
          </div>
        </div>

        <div className="w-full md:w-[50%]">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomBarChart
              data={barchartdata}
              label="Total Balance"
              colors={COLORS}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4  mx-auto">
        {/*  */}
        <div className="sm:col-span-12">
          <div className="card">
            {/* button */}
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent tasks</h5>

              <button className="card-btn" onClick={Seemore}>
                See all <LuArrowRight className="text-base" />
              </button>
            </div>

            <div className="mt-5">
              {dashboardData ? (
                <TaskListTable tableData={dashboardData.recentTasks || {}} />
              ) : (
                <p className="text-2xl h-screen  flex items-center justify-center">
                  No recent tasks
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
