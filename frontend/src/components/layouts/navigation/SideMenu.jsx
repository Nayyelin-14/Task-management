import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [sidemenudata, setSidemenudata] = useState([]);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSidemenudata(
        user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
    return () => {};
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 opacity-90 ">
      <div className="flex flex-col items-center  justify-center mb-7 pt-5">
        <div>
          <img
            src={user?.profileImageUrl}
            alt="profile image"
            className="rounded-full  w-20 h-20"
          />
        </div>
        {user?.role === "admin" && (
          <div className="text-[12px] font-bold bg-blue-400 px-3 py-0.5 rounded-md mt-3 text-white">
            Admin
          </div>
        )}

        <h5 className="text-gray-900 font-semibold leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[13px] text-gray-600/50 font-semibold">
          {user?.email || ""}
        </p>
      </div>

      {sidemenudata.map((data, index) => {
        return (
          <button
            key={index}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === data.label
                ? "text-blue-400 bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-[3px]"
                : ""
            } py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(data.path)}
          >
            <data.icon className="text-xl" />
            {data.label}
          </button>
        );
      })}
    </div>
  );
};

export default SideMenu;
