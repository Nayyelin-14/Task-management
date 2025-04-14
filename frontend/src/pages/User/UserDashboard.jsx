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
  console.log(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
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
      console.log(error);
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
      <h1>hi</h1>
    </DashboardLayout>
  );
};

export default UserDashboard;
