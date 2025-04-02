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
import {
  getCategories,
  deleteCategory,
  updateCategory,
  createCategory,
} from "@/features/categorySlics";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router";
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

const Category = () => {
  const { categories, loading } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    description: "",
  });
  const [currentCategory, setCurrentCategory] = useState(null);

  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCategory = () => {
    dispatch(createCategory(formData));
    setIsDialogOpen(false);
  };
  const handleEditCategory = () => {
    console.log(currentCategory?._id);
    const id = currentCategory?._id;
    dispatch(updateCategory({ id, formData }));
    setIsDialogOpen(false);
  };
  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
    setIsDialogOpen(false);
  };

  const openDialog = (category = null) => {
    setCurrentCategory(category);
    setFormData(
      category
        ? {
            label: category.label,
            value: category.value,
            description: category.description,
          }
        : { label: "", value: "", description: "" }
    );
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Categories</h1>
        <div className="flex gap-4">
          <Button onClick={() => openDialog()}>Add Category</Button>
          <Button onClick={() => navigate("/tag")}>Manage Tag</Button>
        </div>
      </div>

      {/* show the categories in a card form */}

      <div className="flex flex-wrap gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" font-bold">Label</TableHead>
              <TableHead className=" font-bold">Value</TableHead>
              <TableHead className=" font-bold">Description</TableHead>
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
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className=" font-bold">
                    {category?.label}
                  </TableCell>
                  <TableCell>{category?.value}</TableCell>
                  <TableCell>{category?.description ?category?.description :"No Description"}</TableCell>
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
                  <p>No categories found.</p>
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
            <DialogTitle>
              {currentCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {currentCategory
                ? "Update the category details below."
                : "Fill in the details to add a new category."}
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
            <div className="flex items-center justify-between">
              <Textarea
                id="description"
                name="description"
                placeholder="Description"
                className="w-full min-h-48"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={currentCategory ? handleEditCategory : handleAddCategory}
            >
              {currentCategory ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;
