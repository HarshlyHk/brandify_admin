import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  getOrder,
  updateOrder,
  deleteOrder,
  sendTrackingId,
} from "@/features/orderSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import GetRazorPayOrderDetails from "./GetRazorPayOrderDetails";

const paymentStatusOptions = ["Failed", "Pending", "Completed", "Refunded"];
const orderStatusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const deliveryServices = [
  {
    name: "Shree Maruti",
    trackingUrl: "https://www.shreemaruti.com/track-your-shipment/",
  },
  {
    name: "Shiprocket",
    trackingUrl: "https://www.shiprocket.in/shipment-tracking/",
  },
];

const ViewOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, taskLoading } = useSelector((state) => state.order);
  const [open, setOpen] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paymentMethod: "",
    paymentStatus: null,
    shippingAddress: {
      fullName: "",
      street: "",
      locality: "",
      landmark: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phoneNumber: "",
      alternatePhoneNumber: "",
    },
    status: null,
    totalAmount: 0,
    products: [],
  });

  const [trackingFormData, setTrackingFormData] = useState({
    trackingId: "",
    deliveryServiceName: "",
    deliveryServiceUrl: "",
    email: order?.user?.email,
    name: order?.shippingAddress?.fullName,
  });

  useEffect(() => {
    if (!order || order._id !== id) {
      dispatch(getOrder(id));
    } else {
      setFormData({
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        status: order.status,
        totalAmount: order.totalAmount,
        products: order.products,
        email: order.email,
      });
    }
  }, [dispatch, id, order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
    }));
  };

  const handleDelete = (orderId) => {
    dispatch(deleteOrder(orderId));
    navigate("/order/1");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateOrder({ orderId: id, updatedData: formData }));
  };

  const handleSendTrackingId = () => {
    dispatch(sendTrackingId({ orderId: id, ...trackingFormData }));
    setOpen(false);
    setTrackingId("");
    setTrackingFormData({
      trackingId: "",
      deliveryServiceName: "",
      deliveryServiceUrl: "",
      email: order?.user?.email,
      name: order?.shippingAddress?.fullName,
    });
  };

  if (loading || !order) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-md shadow-md space-y-6 mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <h1 className="text-xl font-bold mb-6 text-center uppercase">
          Manage Order -{" "}
          <span
            className={`${
              order?.status === "Shipped"
                ? "text-blue-500"
                : order?.status === "Cancelled"
                ? "text-red-500"
                : order?.status === "Delivered"
                ? "text-green-500"
                : order?.status === "Processing"
                ? "text-yellow-500"
                : "text-pink-500"
            } uppercase `}
          >
            {order?.status}
          </span>
        </h1>
        <div>
          <GetRazorPayOrderDetails orderId={order.transactionId} />
        </div>
      </div>

      <hr />
      <div className=" flex items-center gap-10 justify-center">
        <div className="flex flex-col gap-2 w-60">
          <Label htmlFor="paymentMethod" className=" font-bold uppercase">
            Order ID
          </Label>
          <Input value={order.transactionId} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="paymentMethod" className=" font-bold uppercase">
            Payment Method
          </Label>
          <Input
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            placeholder="e.g. Credit Card, PayPal"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="paymentStatus" className="uppercase font-bold">
            Payment Status
          </Label>
          {formData.paymentStatus != undefined && (
            <Select
              value={formData.paymentStatus}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, paymentStatus: value }))
              }
            >
              <SelectTrigger className="w-60" id="paymentStatus">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex flex-col gap-2 w-60">
          <Label htmlFor="status" className="uppercase font-bold">
            Order Status
          </Label>
          {formData.status != undefined && (
            <div className=" w-60">
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-full" id="status">
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      <hr />

      {/* Email */}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className=" font-bold uppercase">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          placeholder="e.g. user@gmail.com"
        />
      </div>

      {/* Shipping Address */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4 text-center uppercase">
          Shipping Address
        </h3>
        {[
          { name: "fullName", placeholder: "Full Name" },
          { name: "street", placeholder: "Street", isTextarea: true },
          { name: "locality", placeholder: "Locality" },
          { name: "landmark", placeholder: "Landmark" },
          { name: "city", placeholder: "City" },
          { name: "state", placeholder: "State" },
          { name: "country", placeholder: "Country" },
          { name: "zipCode", placeholder: "Zip Code" },
          { name: "phoneNumber", placeholder: "Phone Number" },
          {
            name: "alternatePhoneNumber",
            placeholder: "Alternate Phone Number",
          },
        ].map(({ name, placeholder, isTextarea }) => (
          <div key={name}>
            {isTextarea ? (
              <div className=" flex gap-2">
                <Label className="w-60 uppercase font-bold" htmlFor={name}>
                  {placeholder}
                </Label>
                <Textarea
                  name={name}
                  placeholder={placeholder}
                  value={formData?.shippingAddress?.[name] || ""}
                  onChange={handleAddressChange}
                />
              </div>
            ) : (
              <div className=" flex gap-2">
                <Label className="w-60 uppercase font-bold" htmlFor={name}>
                  {placeholder}
                </Label>
                <Input
                  name={name}
                  placeholder={placeholder}
                  value={formData?.shippingAddress?.[name] || ""}
                  onChange={handleAddressChange}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Status */}

      {/* Total Amount */}
      <div className="flex gap-2">
        <Label htmlFor="totalAmount" className="w-60 font-bold uppercase">
          Total Amount
        </Label>
        <Input
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleInputChange}
        />
      </div>

      {/* Tracking id and deliveryServiceName */}

      <hr />

      <div className="flex gap-4">
        <div className="flex items-center gap-4">
          <div className=" font-bold text-sm uppercase">Tracking ID</div>
          <div className=" font-bold text-sm uppercase">
            {order?.trackingId && order.trackingId}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className=" font-bold text-sm uppercase">Delivery Service</div>
          <div className=" font-bold text-sm uppercase">
            {order?.deliveryServiceName && order.deliveryServiceName}
          </div>
        </div>
      </div>

      <hr />
      {/* Products */}

      <div>
        <h2 className=" text-center font-bold mb-2 uppercase">Products</h2>
        <ul className="list-disc pl-5 space-y-1">
          {formData.products.map((product, index) => (
            <li
              key={index}
              className="flex gap-4 items-center text-sm text-gray-700"
            >
              <img
                src={product?.image}
                alt={product?.name}
                className="w-16 h-16 object-cover"
              />
              <p>{product?.name}</p>
              <p> SIZE-{product?.size}</p>
              <p>QTY.{product?.quantity}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-500 text-white hover:bg-red-700">
              Delete Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this order? This action is
              irreversible.
            </p>
            <DialogFooter className="mt-4">
              <Button
                className="bg-red-500 text-white hover:bg-red-700"
                onClick={() => handleDelete(order._id)}
              >
                Confirm
              </Button>
              <Button variant="ghost">Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className=" flex gap-4">
          {!order?.trackingId && (
            <div
              onClick={() => setOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 cursor-pointer text-sm"
              disabled={taskLoading}
            >
              {taskLoading ? "Sending..." : "Send Tracking ID"}
            </div>
          )}
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={taskLoading}
          >
            {taskLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Tracking ID</DialogTitle>
          </DialogHeader>
          <div className=" mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trackingId" className="uppercase">
                Tracking ID
              </Label>
              <Input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID"
              />
            </div>
            <div>
              <p>Select a delivery service to send the tracking ID:</p>

              <Select
                onValueChange={(value) => {
                  const selectedService = deliveryServices.find(
                    (service) => service.name === value
                  );
                  setTrackingFormData((prev) => ({
                    trackingId,
                    deliveryServiceName: selectedService.name,
                    deliveryServiceUrl: selectedService.trackingUrl,
                    email: order?.user?.email,
                    name: order?.shippingAddress?.fullName,
                  }));
                }}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select delivery service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {deliveryServices.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                handleSendTrackingId();
              }}
            >
              Send
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default ViewOrder;
