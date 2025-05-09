import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/config/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GetRazorPayOrderDetails = ({ orderId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    setLoading(true);
    toast.info("Fetching order details...");
    setError(null);
    try {
      const response = await axiosInstance.post(`/orders/razorpay/${orderId}`);
      setOrderDetails(response.data.data);
    } catch (err) {
      setError("Failed to fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    toast.info("Saving order details...");
    setError(null);
    try {
      const response = await axiosInstance.post(
        `/orders/save-razorpay/${orderId}`,
        orderDetails
      );
      if (response.data.success) {
        toast.success("Order details saved successfully!");
        setOrderDetails(response.data.data);
      } else {
        toast.error("Failed to save order details.");
      }
    } catch (err) {
      setError("Failed to save order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchOrderDetails();
  };

  const handleClose = () => {
    setIsOpen(false);
    setOrderDetails(null);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen}>View Razorpay Order Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Razorpay Order Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orderDetails ? (
          <div className="p-4 space-y-6 text-sm text-gray-700">
            {/* Order Info */}
            <div className="space-y-2">
              <p className="font-medium text-black">Order Information:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">Order ID:</p>
                  <p className="text-gray-500">{orderDetails?.id}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">Amount:</p>
                  <p className="text-gray-500">₹{orderDetails?.amount / 100}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">Status:</p>
                  <p
                    className="text-gray-500 uppercase"
                    style={{
                      color:
                        orderDetails?.status === "paid"
                          ? "green"
                          : orderDetails?.status === "failed"
                          ? "red"
                          : orderDetails?.status === "pending"
                          ? "orange"
                          : "gray",
                    }}
                  >
                    {orderDetails?.status}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-gray-700">Created At:</p>
                  <p className="text-gray-500">
                    {new Date(orderDetails?.created_at * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-gray-700">Receipt:</p>
                  <p className="text-gray-500">{orderDetails?.receipt}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-gray-700">Amount Due:</p>
                  <p className="text-gray-500">{orderDetails?.amount_due / 100}</p>
                </div>
              </div>
            </div>
            <hr />
            {/* Customer Info */}
            <div className="space-y-2">
              <p className="font-medium text-black">Customer Information</p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-gray-700">Customer Name:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.billing_address?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">Contact:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.contact}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            {/* Address Info */}
            <div className="space-y-2">
              <p className="font-medium text-black">Full Address:</p>

              {/* Combined Address */}
              <div>
                <p className="text-gray-500">
                  {`${orderDetails?.customer_details?.shipping_address?.line1}, ${orderDetails?.customer_details?.shipping_address?.line2}, ${orderDetails?.customer_details?.shipping_address?.city}, ${orderDetails?.customer_details?.shipping_address?.state}, ${orderDetails?.customer_details?.shipping_address?.zipcode}`}
                </p>
              </div>
              <hr />

              {/* Individual Address Details */}
              <p className="font-medium text-black">BreakDown:</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">Add Line 1:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.shipping_address?.line1 ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">Add Line 2:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.shipping_address?.line2 ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">City:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.shipping_address?.city ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">State:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.shipping_address?.state ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {" "}
                  <p className="text-gray-700">Zipcode:</p>
                  <p className="text-gray-500">
                    {orderDetails?.customer_details?.shipping_address
                      ?.zipcode || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No details available.</p>
        )}
        <DialogFooter>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleSave}
            disabled={loading || !orderDetails}
          >
            {loading ? "Saving..." : "Save Order Details"}
          </Button>

          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GetRazorPayOrderDetails;
