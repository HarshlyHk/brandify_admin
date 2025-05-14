import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  getAllReturnRefunds,
  updateReturnRefund,
  deleteReturnRefund,
} from "@/features/returnRefundSlice";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { useParams, useNavigate } from "react-router";

const ReturnRefund = () => {
  const dispatch = useDispatch();
  const { returnRefunds, totalRequests, totalPages, loading } = useSelector(
    (state) => state.returnRefund
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { page } = useParams();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllReturnRefunds({ page: page, limit: itemsPerPage }));
    console.log(returnRefunds);
  }, [dispatch, page, itemsPerPage]);

  const handleUpdateStatus = (id, status) => {
    dispatch(updateReturnRefund({ id, updates: { status } }));
  };

  const handleDeleteRequest = (id) => {
    dispatch(deleteReturnRefund(id));
    setShowDialog(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Return/Refund Requests</h2>
        <h4>
          <span className="text-sm text-gray-700">
            Total Requests: {totalRequests}
          </span>
        </h4>
      </div>

      <Table>
        <TableCaption>Manage your return/refund requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Order Id</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : returnRefunds?.length > 0 ? (
            returnRefunds.map((request) => (
              <TableRow key={request._id}>
                <TableCell
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDialog(true);
                  }}
                >
                  {request.name}
                </TableCell>
                <TableCell>{request.orderId}</TableCell>
                <TableCell
                  className={`${
                    request?.type == "Exchange"
                      ? " text-green-500"
                      : " text-red-500"
                  }`}
                >
                  {request.type}
                </TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  {request.createdBy.name} ({request.createdBy.email})
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer hover:bg-blue-700 bg-blue-500 text-white"
                      onClick={() => {
                        navigate(`/orders/${request.order}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      View Order
                    </Button>
                    <Button
                      className="cursor-pointer hover:bg-green-700 bg-green-500 text-white"
                      onClick={() =>
                        handleUpdateStatus(request._id, "Approved")
                      }
                    >
                      Approve
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No return/refund requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-between items-center">
                <Button
                  className="cursor-pointer"
                  disabled={page == 1}
                  onClick={() => navigate(`/return-refund/${Number(page) - 1}`)}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index + 1}
                      className={`cursor-pointer ${
                        page == index + 1
                          ? "bg-black text-white"
                          : "bg-white text-black hover:text-white"
                      }`}
                      onClick={() => navigate(`/return-refund/${index + 1}`)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  className="cursor-pointer"
                  disabled={page == totalPages}
                  onClick={() => navigate(`/return-refund/${Number(page) + 1}`)}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="p-4 space-y-4 text-sm flex flex-col">
              <p>
                <strong>Order ID:</strong> {selectedRequest.orderId}
              </p>
              <p>
                <strong>Name:</strong> {selectedRequest.name}
              </p>
              <p>
                <strong>Message:</strong> {selectedRequest.message}
              </p>
              <p>
                <strong>Type:</strong> {selectedRequest.type}
              </p>
              <p>
                <strong>Status:</strong> {selectedRequest.status}
              </p>
              <p>
                <strong>Created By:</strong> {selectedRequest.createdBy.name} (
                {selectedRequest.createdBy.email})
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedRequest.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              className="text-red-500 border-2 bg-white hover:bg-white"
              onClick={() => setShowDialog(false)}
            >
              Close
            </Button>
            <Button
              className="cursor-pointer hover:bg-red-700 bg-red-500 text-white"
              onClick={() => handleDeleteRequest(selectedRequest._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReturnRefund;
