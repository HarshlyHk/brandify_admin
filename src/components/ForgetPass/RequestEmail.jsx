import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axiosInstance from "@/config/axiosInstance";

const RequestEmail = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await axiosInstance.post("auth/admin/request-email", {
          email: values.email,
        });
        if (res.data.status === 200) {
          toast.success("Email sent successfully!", {
            description: "Please check your inbox for the verification link.",
          });
        } else {
          toast.error(res.data.message || "Failed to send email.");
        }
      } catch (error) {
        toast.error("Failed to send email. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900">Request Email</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email address to receive a verification link
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestEmail;
