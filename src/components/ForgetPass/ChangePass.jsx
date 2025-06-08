import React, { use, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axiosInstance from "@/config/axiosInstance";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePass = () => {
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams(); // Assuming the token is passed as a URL parameter
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await axiosInstance.post("auth/admin/change-password", {
          token,
          newPassword: values.newPassword,
        });
        if (res.data.status == 200) {
          toast.success("Password changed successfully!");
          navigate("/login"); // Redirect to login page after successful password change
        } else {
          toast.error(res.data.message || "Failed to change password.");
        }
      } catch (error) {
        toast.error("Failed to change password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900">Change Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below to update your account.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-xs text-red-600">{formik.errors.newPassword}</p>
          )}

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-xs text-red-600">
              {formik.errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;
