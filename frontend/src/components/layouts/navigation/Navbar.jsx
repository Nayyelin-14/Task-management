import React, { useEffect, useState } from "react";
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi";
import SideMenu from "./SideMenu";
const Navbar = ({ activeMenu }) => {
  const [opensidemenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex bg-white  border border-b border-gray-200/50 backdrop-blue-[2px] py-4  px-7 sticky top-0 z-100">
      <button
        onClick={() => setOpenSideMenu(!opensidemenu)}
        className="block lg:hidden text-black w-12"
      >
        {opensidemenu ? (
          <HiOutlineX className="text-2xl cursor-pointer" />
        ) : (
          <HiOutlineMenu className="text-2xl cursor-pointer" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Expense tracker</h2>

      {opensidemenu && (
        <div className="fixed top-[61px] -ml-4 ">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
