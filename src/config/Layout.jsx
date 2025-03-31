import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import useAuthHook from "../utils/useAuthHook";
const Layout = () => {
  useAuthHook();
  return (
    <div>
      <div className=" min-h-screen flex justify-between">
        <div className=" w-[240px] h-screen">
          <Navbar />
        </div>
        <div>
        <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
