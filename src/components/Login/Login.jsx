import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  loginWithCredentials,
} from "../../features/userSlice";
import { MdPermIdentity } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import CrossIcon from "../Svgs/CrossIcon";
import "./Login.css";
import { BiHide, BiShow } from "react-icons/bi";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useSelector((state) => state.user);
  useEffect(() => {

    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Formik and Yup setup
  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required("Email or Phone Number is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const res = await dispatch(loginWithCredentials(values));
      if (res.meta.requestStatus === "fulfilled") {
          navigate("/dashboard");
      } else {
        console.error("Normal login failed");
      }
    },
  });

  return (
    <>
      <div className="w-full h-screen ">
        <div className="text-black text-[1.5rem] md:text-[2rem] font-rawgly font-bold absolute top-4 left-4">
          DrIp Admin
        </div>
        <div className="w-full h-screen flex justify-center items-center px-4">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-full flex flex-col gap-6 md:gap-10 justify-center items-center px-6 md:px-12 py-10 overflow-auto">
            <div onClick={() => navigate("/")}>
              <CrossIcon
                className="absolute top-2 right-2 cursor-pointer hover:scale-90 transition-all duration-300"
                strokeColor="black"
              />
            </div>
            <h1 className="text-black text-[1.2rem] md:text-[1.5rem] font-poppins font-bold text-center">
              Admin Login
            </h1>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-6 md:gap-8 w-full"
            >
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex justify-start items-center border-b-2 relative p-2 border-gray-500">
                  <MdPermIdentity className="text-gray-600" size={24} />
                  <div className="relative w-full bg-transparent">
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={formik.values.identifier}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 md:p-3 border-none rounded-lg text-gray-600 focus:outline-none focus:ring-[#000] peer bg-transparent text-sm md:text-base"
                    />
                    <label
                      htmlFor="identifier"
                      className={`absolute left-2 md:left-3 top-2 md:top-3 transition-all duration-200 transform ${
                        formik.values.identifier
                          ? "-translate-y-6 md:-translate-y-8 -translate-x-1 md:-translate-x-2 text-xs md:text-sm text-[#000]"
                          : "peer-focus:-translate-y-6 md:peer-focus:-translate-y-8 peer-focus:text-xs md:peer-focus:text-sm peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm md:peer-placeholder-shown:text-[16px] text-gray-500"
                      }`}
                    >
                      Email or Phone
                    </label>
                  </div>
                </div>

                {formik.touched.identifier && formik.errors.identifier && (
                  <div className="text-red-500 text-xs md:text-sm">
                    {formik.errors.identifier}
                  </div>
                )}
                <div className="flex justify-center items-center relative border-b-2 p-2 border-gray-500">
                  <CiLock className="text-black" size={24} />
                  <div className="relative w-full bg-transparent">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete= "off"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full p-2 md:p-3 border-none rounded-lg text-black focus:outline-none focus:ring-[#000] peer bg-transparent text-sm md:text-base"
                    />
                    <label
                      htmlFor="password"
                      className={`absolute left-2 md:left-3 top-2 md:top-3 transition-all duration-200 transform ${
                        formik.values.password
                          ? "-translate-y-6 md:-translate-y-8 -translate-x-1 md:-translate-x-2 text-xs md:text-sm text-[#000]"
                          : "peer-focus:-translate-y-6 md:peer-focus:-translate-y-8 peer-focus:text-xs md:peer-focus:text-sm peer-focus:text-black peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm md:peer-placeholder-shown:text-[16px] text-gray-500"
                      }`}
                    >
                      Password
                    </label>
                  </div>
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-[50%] cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <BiShow className="text-black" size={18} />
                    ) : (
                      <BiHide className="text-black" size={18} />
                    )}
                  </div>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-xs md:text-sm">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                className="mt-4 bg-black py-3 md:py-2 cursor-pointer text-white rounded-[5px] text-sm md:text-base"
              >
                <div className="">Login</div>
              </button>
            </form>
            <div className="flex justify-end items-center w-full">
              <Link to="/forgot-password" className="relative group">
                <span className="text-black text-xs md:text-[14px] font-poppins font-[100]">
                  Forgot Password?
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
