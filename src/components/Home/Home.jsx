import React from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import useAuthHook from "@/utils/useAuthHook";
const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useAuthHook();
  return (
    <div className="w-full h-screen px-4 md:px-20 lg:px-40 py-40 md:py-10">
      <div className="text-start">
        <h1 className="font-helvetica-bold font-bold text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[150px] leading-tight">
          WELCOME TO
        </h1>
      </div>
      <div className="text-end">
        <h1 className="font-rawgly font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px] leading-tight">DRIP ADMIN</h1>
      </div>

      <div className="flex flex-col gap-6 md:gap-10 justify-center items-center mt-40 md:mt-20">
        {user ? (
          <div
            onClick={() => {
              navigate("/dashboard");
            }}
            className="row "
          >
            <div className="btn">
              <p>
                <Link to="/dashboard" className="">
                  <span className=" pl-10">Dashboard</span>
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              navigate("/login");
            }}
            className="row "
          >
            <div className="btn">
              <p>
                <Link to="/login" className="">
                  <span className=" pl-10">Login</span>
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
