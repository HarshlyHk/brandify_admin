import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAbandonedCarts } from "@/features/abandonedCart";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "react-router";

const AbandonedCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { abandonedCarts, loading, totalPages, totalItems } = useSelector(
    (state) => state.abandonedCart
  );
  const { page } = useParams();
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchAbandonedCarts({ page: page || 1, items: itemsPerPage }));
  }, [dispatch, page, itemsPerPage]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Abandoned Carts</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Referral</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : abandonedCarts.length > 0 ? (
            abandonedCarts.map((cart) => (
              <TableRow key={cart._id}>
                <TableCell>
                  <button
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => handleRowClick(cart)}
                  >
                    {cart.name}
                  </button>
                </TableCell>
                <TableCell>{cart.email}</TableCell>
                <TableCell>{cart.phoneNumber}</TableCell>
                <TableCell>₹{cart.totalPrice}</TableCell>
                <TableCell>
                  {new Date(cart.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{cart?.referal}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No abandoned carts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <div className="flex justify-between items-center">
                <Button
                  className="cursor-pointer"
                  disabled={page == 1 || !page}
                  onClick={() => navigate(`/abandoned-carts/${Number(page) - 1}`)}
                >
                  Previous
                </Button>
                <span>
                  Page {page || 1} of {totalPages}
                </span>
                <Button
                  className="cursor-pointer"
                  disabled={page == totalPages}
                  onClick={() => navigate(`/abandoned-carts/${Number(page) + 1}`)}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Abandoned Cart Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="p-4 flex flex-col gap-2">
              <p>
                <strong>Name:</strong> {selectedItem.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedItem.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedItem.phoneNumber}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{selectedItem.totalPrice}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedItem.createdAt).toLocaleDateString()}
              </p>
              <h3 className="text-lg font-bold mt-4">Products</h3>
              {selectedItem.items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <span>Product Name: {item?.productName}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AbandonedCart;