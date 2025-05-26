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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { useParams, useNavigate } from "react-router";
import { deleteContact, getAllContacts } from "@/features/contactSlice";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { contactUs, total, totalPages, loading } = useSelector(
    (state) => state.contactUs
  );
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { page } = useParams();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllContacts({ page: page, limit: itemsPerPage }));
    console.log(contactUs);
  }, [dispatch, page, itemsPerPage]);

  const handleDeleteRequest = (id) => {
    dispatch(deleteContact(id));
    setShowDialog(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <h4>
          <span className="text-sm text-gray-700">Total Messages: {total}</span>
        </h4>
      </div>

      <Table>
        <TableCaption>Manage your Contact Us requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Email</TableHead>
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
          ) : contactUs?.length > 0 ? (
            contactUs.map((request) => (
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

                <TableCell>{request?.phone}</TableCell>
                <TableCell>{request?.email || "N/A"}</TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer hover:bg-red-700 bg-red-500 text-white"
                      onClick={() => {}}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No contact-us requests found.
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
                  onClick={() => navigate(`/contact-us/${Number(page) - 1}`)}
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
                      onClick={() => navigate(`/contact-us/${index + 1}`)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  className="cursor-pointer"
                  disabled={page == totalPages}
                  onClick={() => navigate(`/contact-us/${Number(page) + 1}`)}
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
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="p-4 space-y-4 text-sm flex flex-col">
              <p>
                <strong>Name:</strong> {selectedRequest?.name}
              </p>
              <p>
                <strong>Message:</strong> {selectedRequest?.message}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRequest?.phone || "N/A"}
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

export default ContactUs;
