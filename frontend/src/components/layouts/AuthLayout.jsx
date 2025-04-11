import React from "react";
import image from "./image 3.png";
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task manager</h2>
        {children}
      </div>
      <div className="hidden md:flex w-[60vw]">
        <img src={image} alt="" className=" lg:w-full  object-center" />
      </div>
    </div>
  );
};

export default AuthLayout;
