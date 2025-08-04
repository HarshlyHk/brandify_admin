import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecialFrames,
  createSpecialFrame,
  updateSpecialFrame,
  deleteSpecialFrame,
  toggleSpecialFrameStatus,
} from "@/features/specialFramesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router";

const SpecialFrames = () => {
  const dispatch = useDispatch();
  const { specialFrames, loading } = useSelector(
    (state) => state.specialFrames
  );

  const [newSpecialFrame, setNewSpecialFrame] = useState({
    name: "",
    productUrl: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editSpecialFrame, setEditSpecialFrame] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSpecialFrames());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!newSpecialFrame.name.trim() || !image) {
      alert("Please provide a name and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", newSpecialFrame.name);
    formData.append("productUrl", newSpecialFrame.productUrl || "#");
    formData.append("file", image);

    await dispatch(createSpecialFrame(formData));

    // Reset form
    setNewSpecialFrame({ name: "", productUrl: "" });
    setImage(null);
    setPreview(null);
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!editSpecialFrame.name.trim()) {
      alert("Please provide a name");
      return;
    }

    const formData = new FormData();
    formData.append("name", editSpecialFrame.name);
    formData.append("productUrl", editSpecialFrame.productUrl || "#");

    if (image) {
      formData.append("file", image);
    }

    await dispatch(
      updateSpecialFrame({
        id: editSpecialFrame._id,
        specialFrameData: formData,
      })
    );

    // Reset form
    setEditSpecialFrame(null);
    setImage(null);
    setPreview(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this special frame?")) {
      dispatch(deleteSpecialFrame(id));
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleSpecialFrameStatus(id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditDialog = (specialFrame) => {
    setEditSpecialFrame({ ...specialFrame });
    setImage(null);
    setPreview(null);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Special Frames Management</h2>
        <div className="flex space-x-2">
          <Link
            to="/specialframe-order"
            className="bg-blue-600 text-sm text-white px-4 py-2 rounded-md"
          >
            Change Order
          </Link>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Special Frame
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Special Frame</DialogTitle>
                <DialogDescription>
                  Add a new special frame with an image and details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newSpecialFrame.name}
                    onChange={(e) =>
                      setNewSpecialFrame({
                        ...newSpecialFrame,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter special frame name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productUrl">Product URL (Optional)</Label>
                  <Input
                    id="productUrl"
                    value={newSpecialFrame.productUrl}
                    onChange={(e) =>
                      setNewSpecialFrame({
                        ...newSpecialFrame,
                        productUrl: e.target.value,
                      })
                    }
                    placeholder="Enter product URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {preview && (
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={loading}>
                  {loading ? "Creating..." : "Create Special Frame"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Special Frame</DialogTitle>
            <DialogDescription>
              Update the special frame details.
            </DialogDescription>
          </DialogHeader>
          {editSpecialFrame && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editSpecialFrame.name}
                  onChange={(e) =>
                    setEditSpecialFrame({
                      ...editSpecialFrame,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter special frame name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-productUrl">Product URL (Optional)</Label>
                <Input
                  id="edit-productUrl"
                  value={editSpecialFrame.productUrl}
                  onChange={(e) =>
                    setEditSpecialFrame({
                      ...editSpecialFrame,
                      productUrl: e.target.value,
                    })
                  }
                  placeholder="Enter product URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Change Image (Optional)</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                />
                <div className="flex gap-2 mt-2">
                  {preview && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">New Image:</p>
                      <img
                        src={preview}
                        alt="New Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  {editSpecialFrame.imageUrl && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Current Image:
                      </p>
                      <img
                        src={editSpecialFrame.imageUrl}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Special Frame"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Special Frames Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Product URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading special frames...
                </TableCell>
              </TableRow>
            ) : specialFrames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No special frames found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              specialFrames.map((specialFrame) => (
                <TableRow key={specialFrame._id}>
                  <TableCell>
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={specialFrame.thumbnailUrl || specialFrame.imageUrl}
                        alt={specialFrame.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {specialFrame.name}
                  </TableCell>
                  <TableCell>
                    <a
                      href={specialFrame.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {specialFrame.productUrl === "#"
                        ? "No URL"
                        : "View Product"}
                    </a>
                  </TableCell>

                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(specialFrame)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(specialFrame._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SpecialFrames;
