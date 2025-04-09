import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getOrder, updateOrder } from "@/features/orderSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ViewOrder = () => {
  const { id } = useParams(); // Order ID from route
  const dispatch = useDispatch();
  const { order, loading, taskLoading } = useSelector((state) => state.order);
  const [formData, setFormData] = useState({
    paymentMethod: "",
    paymentStatus: "",
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
    status: "",
    totalAmount: 0,
    products: [],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateOrder({ orderId: id, updatedData: formData }));
  };

  if (loading || !order) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-md">
      <h1 className="text-2xl font-bold mb-4">View/Edit Order</h1>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <Input
          type="text"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
        />
      </div>

      {/* Payment Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Payment Status</label>
        <Input
          type="text"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleInputChange}
        />
      </div>

      {/* Shipping Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Shipping Address</label>
        <Input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.shippingAddress.fullName}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Textarea
          name="street"
          placeholder="Street"
          value={formData.shippingAddress.street}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="locality"
          placeholder="Locality"
          value={formData.shippingAddress.locality}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="landmark"
          placeholder="Landmark"
          value={formData.shippingAddress.landmark}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="city"
          placeholder="City"
          value={formData.shippingAddress.city}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="state"
          placeholder="State"
          value={formData.shippingAddress.state}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.shippingAddress.country}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.shippingAddress.zipCode}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.shippingAddress.phoneNumber}
          onChange={handleAddressChange}
          className="mb-2"
        />
        <Input
          type="text"
          name="alternatePhoneNumber"
          placeholder="Alternate Phone Number"
          value={formData.shippingAddress.alternatePhoneNumber}
          onChange={handleAddressChange}
        />
      </div>

      {/* Order Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Order Status</label>
        <Input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        />
      </div>

      {/* Total Amount */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Total Amount</label>
        <Input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleInputChange}
        />
      </div>

      {/* Products */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Products</h2>
        <ul className="list-disc pl-5">
          {formData.products.map((product, index) => (
            <li key={index} className="mb-2">
              <span className="font-medium">{product.name}</span> - Quantity:{" "}
              {product.quantity}
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={taskLoading}
      >
        {taskLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ViewOrder;