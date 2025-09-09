import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useAuthHook from "../utils/useAuthHook";
const Layout = () => {
  useAuthHook();
  return (
    <div>
      <div className=" max-h-screen flex justify-between">
        <div className=" md:static fixed md:w-[240px] z-50 top-0 left-0 w-full ">
          <Navbar />
        </div>
        <div className="flex-1 p-4 overflow-auto md:mt-0 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
