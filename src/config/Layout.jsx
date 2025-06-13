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
        <div className=" md:static fixed md:w-[240px] top-4 left-2">
          <Navbar />
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
