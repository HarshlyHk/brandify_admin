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
  getAllOrdersAdmin,
  deleteOrder,
  updateOrder,
  sendShippingEmail,
  sendOutForDeliveryEmail,
  toggleOrderFlag,
} from "@/features/orderSlice";
import OrderDetails from "./OrderDetails";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ReactPaginate from "react-paginate";
import { IoCheckmarkCircle } from "react-icons/io5";
import { toast } from "sonner";
import SearchOrder from "./SearchOrder";
import DownloadUserEmails from "./DownloadUserEmails";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalOrders, totalPages, loading } = useSelector(
    (state) => state.order
  );
  const { orders } = useSelector((state) => state.order);
  const { page } = useParams();
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [specialFilter, setSpecialFilter] = useState("new");

  useEffect(() => {
    dispatch(
      getAllOrdersAdmin({ page: page, items: itemsPerPage, specialFilter })
    );
  }, [dispatch, itemsPerPage, page, specialFilter]);

  const updateDeliveryStatus = (orderId) => {
    dispatch(updateOrder(orderId));
  };

  const updatePaymentStatus = (orderId) => {
    dispatch(updateOrder(orderId));
  };

  const sendShippingEmailHandler = (orderId) => {
    dispatch(sendShippingEmail(orderId));
  };
  const sendOutForDeliveryEmailHandler = (orderId) => {
    dispatch(sendOutForDeliveryEmail(orderId));
  };
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleToggleFlag = (orderId, flag) => {
    dispatch(toggleOrderFlag({ orderId, flag }));
  };

  return (
    <div className="md:px-6 px-2">
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="">
          <SearchOrder />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-2">
            <Link to="/failed-orders/1">
              <Button className="bg-red-500 text-white hover:bg-red-700">
                Failed Orders
              </Button>
            </Link>
            <DownloadUserEmails />
          </div>
          <h4>
            <span className="text-sm text-gray-700">
              Total Orders: {totalOrders}
            </span>
          </h4>
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div className=" flex md:gap-10 gap-4">
          <div className=" ">
            <Label htmlFor="items-per-page" className=" mb-2">
              Items per page:
            </Label>
            <Select
              onValueChange={(value) => setItemsPerPage(Number(value))}
              defaultValue={itemsPerPage.toString()}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Label htmlFor="items-per-page" className=" mb-2">
              Filter Orders:
            </Label>
            <Select
              onValueChange={(value) => setSpecialFilter(value)}
              defaultValue="all"
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select New or Old Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="newPixel">New Pixel</SelectItem>
                  <SelectItem value="oldPixel">Old Pixel</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="md:flex hidden items-center gap-2 ">
          <div className="flex items-center gap-2 text-sm">
            <IoCheckmarkCircle className="text-red-500" size={20} />
            <p>Not Shipped</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IoCheckmarkCircle className="text-green-500" size={20} />
            <p>Shipped</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IoCheckmarkCircle className="text-blue-500" size={20} />
            <p>Out for Delivery</p>
          </div>
        </div>
      </div>
      <Table>
        <TableCaption>Manage your orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Send Mail</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Date</TableHead>
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
                <TableCell className="flex items-center">
                  <div className="flex items-center h-20">
                    {order?.status !== "Shipped" &&
                      order?.status !== "Out for Delivery" &&
                      order?.status !== "Delivered" && (
                        <button
                          onClick={() => {
                            if (order?.status === "Shipped") {
                              toast.error(
                                "Email is already sent, cannot resend."
                              );
                              return;
                            }
                            sendShippingEmailHandler(order._id);
                          }}
                        >
                          <span className="cursor-pointer">
                            <IoCheckmarkCircle
                              className="inline-block mr-1 text-red-500"
                              size={24}
                            />
                            Send Shipped
                          </span>
                        </button>
                      )}

                    {(order?.status === "Shipped" ||
                      order?.status === "Out for Delivery") && (
                      <button
                        onClick={() => {
                          if (order?.status === "Out for Delivery") {
                            toast.error(
                              "Email is already sent, cannot resend."
                            );
                            return;
                          }
                          sendOutForDeliveryEmailHandler(order._id);
                        }}
                      >
                        <span className="cursor-pointer">
                          <IoCheckmarkCircle
                            className={`inline-block mr-1 ${
                              order?.status === "Out for Delivery"
                                ? "text-blue-500"
                                : "text-green-500"
                            }`}
                            size={24}
                          />
                          {order?.status === "Out for Delivery"
                            ? "Out for Delivery"
                            : "Send OFD"}
                        </span>
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="cursor-pointer h-20">
                  <button
                    className=" cursor-pointer hover:underline hover:text-blue-500 flex flex-col gap-2 items-start"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDialog(true);
                    }}
                  >
                    <p>{order?.shippingAddress?.fullName}</p>
                    <p
                      className={` uppercase ${
                        order?.utmParams?.CampaignName
                          ? "text-red-400"
                          : "text-blue-400"
                      }`}
                    >
                      {order?.utmParams?.CampaignName != null
                        ? "META"
                        : order?.utmParams?.Fbclid != null
                        ? "INSTAGRAM"
                        : ""}
                    </p>
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <p>₹{order?.totalAmount}</p>
                    {order?.amountPaid > 0 && (
                      <p className="text-gray-500">₹{order?.amountPaid} Paid</p>
                    )}
                  </div>
                </TableCell>
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
                <TableCell
                  className={
                    order?.status === "Shipped"
                      ? "text-green-600"
                      : order?.status === "Delivered"
                      ? "text-blue-600"
                      : order?.status === "Cancelled"
                      ? "text-red-600"
                      : order?.status === "Processing"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }
                >
                  {order?.status}
                </TableCell>
                <TableCell className=" uppercase text-center">
                  {new Date(order?.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  <div className="flex justify-center gap-2 mt-1">
                    <Button
                      size="sm"
                      variant={order?.orderListed ? "default" : "outline"}
                      className="px-2 py-1 text-xs rounded-sm"
                      onClick={() =>
                        handleToggleFlag(order?._id, "orderListed")
                      }
                    >
                      L
                    </Button>
                    <Button
                      size="sm"
                      variant={order?.orderShipped ? "default" : "outline"}
                      className="px-2 py-1 text-xs rounded-sm"
                      onClick={() =>
                        handleToggleFlag(order?._id, "orderShipped")
                      }
                    >
                      S
                    </Button>
                    <Button
                      size="sm"
                      variant={order?.orderDelivered ? "default" : "outline"}
                      className="px-2 py-1 text-xs rounded-sm"
                      onClick={() =>
                        handleToggleFlag(order?._id, "orderDelivered")
                      }
                    >
                      D
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer hover:bg-green-700 bg-green-500 text-white"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View
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
              <ReactPaginate
                pageCount={totalPages}
                forcePage={Number(page) - 1}
                onPageChange={(selectedItem) =>
                  navigate(`/order/${selectedItem.selected + 1}`)
                }
                marginPagesDisplayed={1} // pages at start/end
                pageRangeDisplayed={10} // pages around current
                previousLabel="Previous"
                nextLabel="Next"
                previousClassName={`text-white bg-black px-4 py-2 rounded transition-all duration-300  ${
                  page == 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } `}
                nextClassName={`text-white bg-black px-4 py-2 rounded transition-all duration-300  ${
                  page == totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } `}
                containerClassName="flex gap-4 justify-center items-center "
                activeClassName=" bg-black text-white hover:text-white text-white  rounded"
                pageClassName=" text-black "
                pageLinkClassName="hover:bg-black transition-all duration-300  hover:text-white px-4 py-2  cursor-pointer rounded"
                activeLinkClassName="bg-black text-white hover:text-white px-4 py-2 rounded"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <OrderDetails
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default Orders;
