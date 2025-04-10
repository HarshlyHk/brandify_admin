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

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalOrders, totalPages, loading } = useSelector(
    (state) => state.order
  );
  const { orders } = useSelector((state) => state.order);
  const { page } = useParams();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersAdmin({ page: page, items: itemsPerPage }));
  }, [dispatch, itemsPerPage, page]);

  const handleDelete = (orderId) => {
    dispatch(deleteOrder(orderId));
  };

  const updateDeliveryStatus = (orderId) => {
    dispatch(updateOrder(orderId));
  };

  const updatePaymentStatus = (orderId) => {
    dispatch(updateOrder(orderId));
  };

  console.log("Orders:", orders);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders</h2>
        <h4>
          <span className="text-sm text-gray-500">
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
            <TableHead>Delivery</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : orders.length > 0 ? (
            sortedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="cursor-pointer">
                  <button
                    className=" cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDialog(true);
                    }}
                  >
                    {order.user.name}
                  </button>
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell
                  className={`${
                    order.paymentStatus === "Completed"
                      ? "text-teal-700"
                      : order.paymentStatus === "Pending"
                      ? "text-yellow-800"
                      : order.paymentStatus === "Failed"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {order.paymentStatus}
                </TableCell>
                <TableCell
                  className={`${
                    order?.paymentMethod == "PhonePe"
                      ? " text-purple-600"
                      : "text-black"
                  }`}
                >
                  {order.paymentMethod}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer hover:bg-green-700 bg-green-500 text-white"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      Edit
                    </Button>
                    {/* <Button
                      className="cursor-pointer hover:bg-blue-700 bg-blue-500 text-white"
                      onClick={() => dispatch(updateOrder(order._id))}
                    >
                      Update
                    </Button> */}
                    {/* <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-red-500 text-white hover:bg-red-700 cursor-pointer">
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Order</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            className="bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                            onClick={() => handleDelete(order._id)}
                          >
                            Confirm
                          </Button>
                          <Button variant="ghost">Cancel</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <div className="flex justify-between items-center">
                <Button
                  className="cursor-pointer"
                  disabled={page == 1}
                  onClick={() => navigate(`/order/${Number(page) - 1}`)}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="p-4 ">
              <div className=" flex flex-col gap-4">
                <h2 className=" font-bold">
                  Account Name : {selectedOrder.user.name}
                </h2>

                <p>
                  <strong>Name:</strong>{" "}
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.user?.email}
                </p>
                <div className="flex flex-col">
                  <p className=" font-bold">Full Address- </p>
                  <p>
                    {selectedOrder.shippingAddress.street},{" "}
                    {selectedOrder.shippingAddress.locality},{" "}
                    {selectedOrder.shippingAddress.landmark},{" "}
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.state},{" "}
                    {selectedOrder.shippingAddress.country} -{" "}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4"> 
                  <p className="flex">
                    <strong>Landmark:</strong>{" "}
                    {selectedOrder.shippingAddress?.landmark}
                  </p>
                  <p className="flex">
                    <strong>Street:</strong>{" "}
                    {selectedOrder.shippingAddress?.street}
                  </p>
                  <p>
                    <strong>Locality:</strong>{" "}
                    {selectedOrder.shippingAddress?.locality}
                  </p>
                  <p className="">
                    <strong>City:</strong> {selectedOrder.shippingAddress?.city}
                  </p>
                  <p>
                    <strong>State:</strong>{" "}
                    {selectedOrder.shippingAddress?.state}
                  </p>
                  <p>
                    <strong>Country:</strong>{" "}
                    {selectedOrder.shippingAddress?.country}
                  </p>
                  <p>
                    <strong>Zip Code: </strong>
                    {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p>
                    <strong>Phone: </strong>
                    {selectedOrder.shippingAddress.phoneNumber}
                  </p>
                </div>
                {selectedOrder.shippingAddress.alternatePhoneNumber && (
                  <p>
                    Alternate Phone:{" "}
                    {selectedOrder.shippingAddress.alternatePhoneNumber}
                  </p>
                )}
              </div>
              <h3 className="text-lg font-bold mt-4">Products</h3>
              {selectedOrder.products.map((product) => (
                <div key={product._id} className="flex gap-4">
                  <span>{product.name}</span>
                  <span>Qty: {product.quantity}</span>
                  <span>Size: {product.size}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
