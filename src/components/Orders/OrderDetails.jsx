import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const OrderDetails = ({ showDialog, setShowDialog, selectedOrder }) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-y-scroll p-0  ">
        <DialogHeader className=" sticky top-0 bg-white z-10 p-4">
          <DialogTitle className="text-xl font-semibold">
            Order Details : {selectedOrder?._id}
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
                  <div className="flex flex-col">
                    <span className="text-gray-700">Alternate Phone</span>
                    <span className="text-gray-500">
                      {selectedOrder.shippingAddress?.alternatePhoneNumber
                        ? selectedOrder.shippingAddress?.alternatePhoneNumber
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <hr />

              {/* order notes : orderNotes*/}
              {selectedOrder.orderNotes && (
                <>
                  <div className="space-y-2 flex flex-col py-4">
                    <p className="font-medium text-[#ff4d00]">Order Notes:</p>
                    <p className="text-[#ae00ff] mb-4">
                      {selectedOrder.orderNotes}
                    </p>
                  </div>
                  <hr className=" " />
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
  );
};

export default OrderDetails;
