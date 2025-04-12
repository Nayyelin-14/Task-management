import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuFileSpreadsheet } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import UserCard from "../../components/Cards/UserCard";

const ManageUser = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const getallusers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      console.log(response);
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getallusers();
  }, []);
  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="my-8">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-medium text-gray-600 ">Team Members</h2>
          <button className="flex downloadBtn">
            <LuFileSpreadsheet /> Download Users
          </button>
        </div>
        {user.length == 0 && (
          <div className="flex items-center justify-center h-full mt-10 text-xl text-red-500 font-medium">
            There is no team members
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {user?.map((u) => (
            <UserCard key={u._id} userInfo={u} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
