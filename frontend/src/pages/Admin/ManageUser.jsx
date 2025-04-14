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

  const HandleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USERS, {
        responseType: "blob", //blob stands for Binary Large Object. used for images, audio, video, or in this case, Excel files.
      });
      // console.log(response);

      const url = window.URL.createObjectURL(new Blob([response.data])); ////Converts the binary data (Blob) into a temporary URL that the browser can use to download.new Blob([response.data]): wraps the raw response data into a Blob object.
      // console.log(url);
      const link = document.createElement("a"); ///Creates an invisible <a> tag.
      link.href = url; //Sets href to the blob URL.
      link.setAttribute("download", "user_details.xlsx"); //Adds a download attribute with the desired filename. <a download="user_details.xlsx" href="url">Download</a> // element.setAttribute(attributeName, value);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); ///Removes the temporary <a> element from the DOM.
      window.URL.revokeObjectURL(url); //Releases the blob URL from memory (important for performance).
    } catch (error) {
      toast.error("Error downloading  report");
    }
  };

  useEffect(() => {
    getallusers();
  }, []);
  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="my-8">
        <div className="flex items-center justify-between  mb-7">
          <h2 className="text-xl font-medium text-gray-600 ">Team Members</h2>
          <button className="flex downloadBtn" onClick={() => HandleDownload()}>
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
