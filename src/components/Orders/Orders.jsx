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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

  useEffect(() => {
    dispatch(getAllOrdersAdmin({ page: page, items: itemsPerPage }));
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
        <div className="flex gap-4 items-center">
          <Link to="/failed-orders/1">
            <Button className="bg-red-500 text-white hover:bg-red-700">
              Failed Orders
            </Button>
          </Link>
          <h4>
            <span className="text-sm text-gray-700">
              Total Orders: {totalOrders}
            </span>
          </h4>
        </div>
      </div>
      <div className="mb-4">
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
      <Table>
        <TableCaption>Manage your orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead>Delivery</TableHead>
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
                  <button
                    className=" cursor-pointer flex flex-col gap-2 items-start"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDialog(true);
                    }}
                  >
                    <p>{order?.shippingAddress?.fullName}</p>
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
                <TableCell>{order?.status}</TableCell>
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
                    {/* <Button
                      className="cursor-pointer hover:bg-red-700 bg-red-500 text-white"
                      onClick={() => dispatch(deleteOrder(order._id))}
                    >
                      Delete
                    </Button> */}
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
              <div className="flex justify-between items-center  ">
                <Button
                  className="cursor-pointer"
                  disabled={page == 1}
                  onClick={() => navigate(`/order/${Number(page) - 1}`)}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index + 1}
                      className={`cursor-pointer ${
                        Number(page) === index + 1
                          ? "bg-black text-white"
                          : " bg-white text-black hover:text-white"
                      }`}
                      onClick={() => navigate(`/order/${index + 1}`)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  className="cursor-pointer"
                  disabled={page == totalPages}
                  onClick={() => navigate(`/order/${Number(page) + 1}`)}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-y-scroll p-0">
          <DialogHeader className=" sticky top-0 bg-white z-10 p-4">
            <DialogTitle className="text-xl font-semibold">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="p-4 space-y-6 text-sm text-gray-700">
              {/* User Info */}
              <div className="flex justify-between items-start p-4">
                <div className="space-y-1 flex flex-col">
                  <div>
                    <p className="font-medium w-32">Account Name:</p>
                    <p className="text-gray-500"> {selectedOrder.user.name}</p>
                  </div>

                  <div>
                    <p className="font-medium w-32">Recipient Name:</p>
                    <p className="text-gray-500">
                      {selectedOrder.shippingAddress.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium w-32">Email:</p>
                    <p className="text-gray-500">{selectedOrder.user?.email}</p>
                  </div>
                  {selectedOrder?.insta_handle && (
                    <div>
                      <p className="font-medium w-32">Insta Handle:</p>
                      <p className="text-gray-500">
                        {selectedOrder?.insta_handle}
                      </p>
                    </div>
                  )}
                </div>

                {selectedOrder?.utmParams?.Source != null && (
                  <div className="space-y-1 p- flex flex-col">
                    <div>
                      <p className="font-medium w-36">Source:</p>
                      <p className="text-gray-500">
                        {selectedOrder?.utmParams?.Source}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium w-36">Placement:</p>
                      <p className="text-gray-500">
                        {selectedOrder?.utmParams?.Placement}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium w-36">Campaign Name:</p>
                      <p className="text-gray-500">
                        {selectedOrder?.utmParams?.CampaignName}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium w-36">Ad Set Name:</p>
                      <p className="text-gray-500">
                        {selectedOrder?.utmParams?.AdSetName}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium w-36">Ad Name:</p>
                      <p className="text-gray-500">
                        {selectedOrder?.utmParams?.AdName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <hr />
              <div className=" p-4 ">
                {/* Address */}
                <div className="space-y-2 flex flex-col">
                  <p className="font-medium text-black">Full Address:</p>
                  <p className="leading-relaxed text-gray-500 mb-4">
                    {selectedOrder.shippingAddress?.street},{" "}
                    {selectedOrder.shippingAddress?.locality},{" "}
                    {selectedOrder.shippingAddress?.landmark},<br />
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state},{" "}
                    {selectedOrder.shippingAddress?.country} -{" "}
                    {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <hr />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
                    <div className="flex flex-col">
                      <span className="text-gray-700">Street</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.street}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">Locality</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.locality}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">Landmark</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.landmark}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">City</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.city}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">State</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.state}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">Country</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.country}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">Zip Code</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.zipCode}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">Phone</span>
                      <span className="text-gray-500">
                        {selectedOrder.shippingAddress?.phoneNumber}
                      </span>
                    </div>
                    {selectedOrder.shippingAddress.alternatePhoneNumber && (
                      <div className="flex flex-col">
                        <span className="text-gray-700">Alternate Phone</span>
                        <span className="text-gray-500">
                          {selectedOrder.shippingAddress?.alternatePhoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <hr />

                {/* order notes : orderNotes*/}
                {selectedOrder.orderNotes && (
                  <>
                    <div className="space-y-2 flex flex-col py-4">
                      <p className="font-medium text-black">Order Notes:</p>
                      <p className="text-gray-500 mb-4">
                        {selectedOrder.orderNotes}
                      </p>
                    </div>
                    <hr />
                  </>
                )}

                {/* Products */}
                <div className=" my-8">
                  <p className="font-medium">Products</p>
                  <div className="flex flex-col gap-4 mt-4">
                    {selectedOrder.products.map((product) => (
                      <div
                        key={product._id}
                        className="flex justify-between items-center border border-gray-200 rounded-md p-3 bg-gray-50"
                      >
                        <img
                          src={product?.image}
                          alt={product?.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <span className=" w-80">{product?.name}</span>
                        <span>Qty: {product?.quantity}</span>
                        <span>Size: {product?.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className=" p-4">
            <Button
              className="text-red-500 border-2 bg-white hover:bg-white"
              onClick={() => setShowDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
