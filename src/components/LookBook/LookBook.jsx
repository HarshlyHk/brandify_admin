import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLookBooks,
  createLookBook,
  updateLookBook,
  deleteLookBook,
  toggleLookBookStatus,
} from "@/features/lookBookSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
import { Textarea } from "../ui/textarea";
import { Link } from "react-router";

const LookBook = () => {
  const dispatch = useDispatch();
  const { lookBooks, loading } = useSelector((state) => state.lookBook);

  const [newLookBook, setNewLookBook] = useState({ name: "", productUrl: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editLookBook, setEditLookBook] = useState(null);

  useEffect(() => {
    dispatch(fetchLookBooks());
  }, [dispatch]);

  const handleCreate = () => {
    const formData = new FormData();

    if (!newLookBook.name) {
      alert("Name is required");
      return;
    }

    if (!newLookBook.productUrl) {
      alert("Product URL is required");
      return;
    }

    if (!image) {
      alert("Image/Video is required");
      return;
    }

    formData.append("name", newLookBook.name);
    formData.append("productUrl", newLookBook.productUrl);
    if (image) {
      formData.append("file", image);
    }
    dispatch(createLookBook(formData));
    setNewLookBook({ name: "", productUrl: "" });
    setImage(null);
    setPreview(null);
  };

  const handleUpdate = () => {
    if (editLookBook) {
      dispatch(
        updateLookBook({ id: editLookBook._id, lookBookData: editLookBook })
      );
      setEditLookBook(null);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteLookBook(id));
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleLookBookStatus(id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file.type.startsWith("image/")) {
      setPreview({ type: "image", url: URL.createObjectURL(file) });
    } else if (file.type.startsWith("video/")) {
      setPreview({ type: "video", url: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Look Book</h2>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link to="/lookbook-order">Update Priority</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className={"bg-green-500 hover:bg-green-600"}>
                Create LookBook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Look Book</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Name"
                value={newLookBook.name}
                onChange={(e) =>
                  setNewLookBook({ ...newLookBook, name: e.target.value })
                }
              />
              <Input
                placeholder="Product URL"
                value={newLookBook.productUrl}
                onChange={(e) =>
                  setNewLookBook({ ...newLookBook, productUrl: e.target.value })
                }
              />

              {preview ? (
                <div className="mt-4 flex justify-center">
                  {preview.type === "image" ? (
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="w-[200px] h-[200px] object-cover rounded-md border border-gray-300"
                    />
                  ) : (
                    <video
                      src={preview.url}
                      controls
                      loop
                      muted
                      autoPlay
                      className="w-[200px] h-[200px] object-cover rounded-md border border-gray-300"
                    />
                  )}
                </div>
              ) : (
                <div className="mt-4 flex justify-center">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer h-[200px] w-[200px] flex items-center justify-center border-2 border-dashed rounded-md text-gray-500 hover:border-gray-400"
                  >
                    Upload Image / Video
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
              <DialogFooter>
                <Button
                  className={"bg-red-500 hover:bg-red-600"}
                  onClick={() => {
                    setNewLookBook({ name: "", productUrl: "" });
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleCreate}
                  className={"bg-green-500 hover:bg-green-600"}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Product Url </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lookBooks.map((lookBook) => (
              <TableRow key={lookBook._id}>
                <TableCell>
                  {lookBook?.isVideo ? (
                    <video
                      src={lookBook.imageUrl}
                      controls
                      className="w-32 h-32 object-contain rounded-md"
                    />
                  ) : (
                    <img
                      src={lookBook.imageUrl}
                      alt={lookBook.name}
                      className="w-32 h-32 object-contain rounded-md"
                    />
                  )}
                </TableCell>
                <TableCell className="w-[200px]">{lookBook.name}</TableCell>
                <TableCell>{lookBook.productUrl}</TableCell>
                <TableCell>
                  {lookBook.isActive ? "Active" : "Inactive"}
                </TableCell>
                <TableCell className="w-[200px] text-end ">
                  <div className="flex gap-2">
                    {/* <Button onClick={() => handleToggleStatus(collabo._id)}>
                      Toggle Status
                    </Button> */}
                    <Dialog>
                      <DialogTrigger asChild>
                        {/* <Button>Edit</Button> */}
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit LookBook</DialogTitle>
                        </DialogHeader>
                        <Input
                          placeholder="Name"
                          value={editLookBook?.name || ""}
                          onChange={(e) =>
                            setEditLookBook({
                              ...editLookBook,
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Description"
                          value={editLookBook?.productUrl || ""}
                          onChange={(e) =>
                            setEditLookBook({
                              ...editLookBook,
                              productUrl: e.target.value,
                            })
                          }
                        />
                        <DialogFooter>
                          <Button onClick={handleUpdate}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => handleDelete(lookBook._id)}
                      className="bg-red-500"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LookBook;
