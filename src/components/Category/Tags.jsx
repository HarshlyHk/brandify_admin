import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getTags, createTag, deleteTag, updateTag } from "@/features/tagSlice";
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

const Tag = () => {
  const { tags, loading } = useSelector((state) => state.tags);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
  });
  const [currentTag, setCurrentTag] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTag = () => {
    dispatch(createTag(formData));
    setIsDialogOpen(false);
  };
  const handleEditTag = () => {
    console.log(currentTag?._id);
    const id = currentTag?._id;
    dispatch(updateTag({ id, formData }));
    setIsDialogOpen(false);
  };
  const handleDeleteTag = (id) => {
    dispatch(deleteTag(id));
    setIsDialogOpen(false);
  };

  const openDialog = (tag = null) => {
    setCurrentTag(tag);
    setFormData(
      tag
        ? {
            label: tag.label,
            value: tag.value,
          }
        : { label: "", value: "" }
    );
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Tags</h1>
        <Button onClick={() => openDialog()}>Add Tag</Button>
      </div>

      {/* show the categories in a card form */}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" font-bold">Label</TableHead>
              <TableHead className=" font-bold">Value</TableHead>
              <TableHead className=" text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <p>Loading...</p>
                </TableCell>
              </TableRow>
            ) : tags.length > 0 ? (
              tags.map((tag) => (
                <TableRow key={tag._id}>
                  <TableCell className=" font-bold">{tag?.label}</TableCell>
                  <TableCell>{tag?.value}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => openDialog(tag)}
                        className="bg-blue-500 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteTag(tag?._id)}
                        className="bg-red-500 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <p>No tags found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTag ? "Edit Tag" : "Add Tag"}</DialogTitle>
            <DialogDescription>
              {currentTag
                ? "Update the tag details below."
                : "Fill in the details to add a new tag."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                name="label"
                className="w-60"
                value={formData.label}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                className="w-60"
                value={formData.value}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!formData.label || !formData.value}
              onClick={currentTag ? handleEditTag : handleAddTag}
            >
              {currentTag ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tag;
