import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllFailedOrdersAdmin,
  deleteOrder,
  updateOrder,
} from "@/features/orderSlice";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";

const FailedOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalOrders, totalPages, loading } = useSelector(
    (state) => state.order
  );
  const orders = useSelector((state) => state.order.failedOrders);
  const { page } = useParams();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllFailedOrdersAdmin({ page: page, items: itemsPerPage }));
  }, [dispatch, itemsPerPage, page]);

  const updateDeliveryStatus = (orderId) => {
    dispatch(updateOrder(orderId));
  };

  const updatePaymentStatus = (orderId) => {
    dispatch(updateOrder(orderId));
  };

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <h4>
          <span className="text-sm text-gray-700">
            Total Orders: {totalOrders}
          </span>
        </h4>
      </div>

      <Table>
        <TableCaption>Manage your orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <TableRow>
                  <TableCell key={index} colSpan={8}>
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : orders.length > 0 ? (
            sortedOrders.map((order) => (
              <TableRow key={order?._id}>
                <TableCell className="cursor-pointer h-20">
                  <button className=" cursor-pointer flex flex-col gap-2 items-start">
                    <p>{order?.user?.name}</p>
                    <p className=" uppercase text-red-400">{order?.referal}</p>
                  </button>
                </TableCell>
                <TableCell>₹{order?.totalAmount}</TableCell>
                <TableCell
                  className={`${
                    order.paymentStatus === "Completed"
                      ? "text-teal-700"
                      : order.paymentStatus === "Pending"
                      ? "text-yellow-800"
                      : order.paymentStatus === "Failed"
                      ? "text-red-500"
                      : "text-gray-700"
                  }`}
                >
                  {order?.paymentStatus}
                </TableCell>
                <TableCell
                  className={`${
                    order?.paymentMethod == "PhonePe"
                      ? " text-purple-600"
                      : order?.paymentMethod == "RAZORPAY"
                      ? "text-blue-600"
                      : order?.paymentMethod == "COD"
                      ? "text-orange-600"
                      : "text-blue-600"
                  }`}
                >
                  {order?.paymentMethod}
                </TableCell>
                <TableCell>
                  {new Date(order?.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                  })}
                </TableCell>{" "}
                <TableCell>
                  {new Date(order?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer hover:bg-green-700 bg-green-500 text-white"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View
                    </Button>
                    <Button
                      className="cursor-pointer hover:bg-red-700 bg-red-500 text-white"
                      onClick={() =>
                        setShowDialog(true) || setSelectedOrder(order._id)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <div className="flex justify-between items-center">
                <Button
                  className="cursor-pointer"
                  disabled={page == 1}
                  onClick={() => navigate(`/failed-orders/${Number(page) - 1}`)}
                >
                  Previous
                </Button>
                <div
                  className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  style={{ maxWidth: "60vw" }}
                >
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index + 1}
                      className={`cursor-pointer ${
                        Number(page) === index + 1
                          ? "bg-black text-white"
                          : " bg-white text-black hover:text-white"
                      }`}
                      onClick={() => navigate(`/failed-orders/${index + 1}`)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  className="cursor-pointer"
                  disabled={page == totalPages}
                  onClick={() => navigate(`/failed-orders/${Number(page) + 1}`)}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="">
          <DialogHeader className=" ">
            <DialogTitle className="">Delete Order</DialogTitle>
          </DialogHeader>
          <div className="">
            <p className="text-gray-700 text-sm">
              Are you sure you want to delete this order?
            </p>
          </div>

          <DialogFooter className="">
            <Button
              className="bg-red-500 text-white border-2 border-red-500 hover:bg-red-700"
              onClick={() => {
                dispatch(deleteOrder(selectedOrder));
                setShowDialog(false);
              }}
            >
              Delete
            </Button>
            <Button className=" border-2" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FailedOrders;
