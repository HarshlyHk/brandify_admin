import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCollabos,
  createCollabo,
  updateCollabo,
  deleteCollabo,
  toggleCollaboStatus,
} from "@/features/collaboSlice";
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

const Collabos = () => {
  const dispatch = useDispatch();
  const { collabos, loading } = useSelector((state) => state.collabo);

  const [newCollabo, setNewCollabo] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editCollabo, setEditCollabo] = useState(null);

  useEffect(() => {
    dispatch(fetchCollabos());
  }, [dispatch]);

  const handleCreate = () => {
    const formData = new FormData();

    if (!newCollabo.name) {
      alert("Name is required");
      return;
    }

    if (!image) {
      alert("Image/Video is required");
      return;
    }

    formData.append("name", newCollabo.name);
    formData.append("description", newCollabo.description);
    if (image) {
      formData.append("file", image);
    }
    dispatch(createCollabo(formData));
    setNewCollabo({ name: "", description: "" });
    setImage(null);
    setPreview(null);
  };

  const handleUpdate = () => {
    if (editCollabo) {
      dispatch(
        updateCollabo({ id: editCollabo._id, collaboData: editCollabo })
      );
      setEditCollabo(null);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteCollabo(id));
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleCollaboStatus(id));
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
        <h2 className="text-xl font-bold mb-4">Collabos</h2>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Link to="/collabo-order">Update Priority</Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Collabo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collabo</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Name"
                value={newCollabo.name}
                onChange={(e) =>
                  setNewCollabo({ ...newCollabo, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Description (optional)"
                value={newCollabo.description}
                onChange={(e) =>
                  setNewCollabo({ ...newCollabo, description: e.target.value })
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
                    setNewCollabo({ name: "", description: "" });
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handleCreate}>Create</Button>
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
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collabos.map((collabo) => (
              <TableRow key={collabo._id}>
                <TableCell>
                  {collabo.imageUrl && collabo.imageUrl.endsWith(".mp4") ? (
                    <video
                      src={collabo.imageUrl}
                      controls
                      className="w-40 h-40 object-contain rounded-md"
                    />
                  ) : (
                    <img
                      src={collabo.imageUrl}
                      alt={collabo.name}
                      className="w-40 h-40 object-contain rounded-md"
                    />
                  )}
                </TableCell>
                <TableCell className="w-[200px]">{collabo.name}</TableCell>
                <TableCell>{collabo.description}</TableCell>
                <TableCell>
                  {collabo.isActive ? "Active" : "Inactive"}
                </TableCell>
                <TableCell className="w-[200px] text-end ">
                  <div className="flex gap-2">
                    <Button onClick={() => handleToggleStatus(collabo._id)}>
                      Toggle Status
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Collabo</DialogTitle>
                        </DialogHeader>
                        <Input
                          placeholder="Name"
                          value={editCollabo?.name || ""}
                          onChange={(e) =>
                            setEditCollabo({
                              ...editCollabo,
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Description"
                          value={editCollabo?.description || ""}
                          onChange={(e) =>
                            setEditCollabo({
                              ...editCollabo,
                              description: e.target.value,
                            })
                          }
                        />
                        <DialogFooter>
                          <Button onClick={handleUpdate}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => handleDelete(collabo._id)}
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

export default Collabos;
