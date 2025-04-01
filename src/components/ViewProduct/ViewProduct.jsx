import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct, updateProduct } from "@/features/productSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MultiSelect from "react-select";
import { MdDelete } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "oversizeTees", label: "Oversize Tees" },
  { value: "vest", label: "Vest" },
  { value: "hoodies", label: "Hoodies" },
  { value: "bottoms", label: "Bottoms" },
  { value: "blanks", label: "Blanks" },
  { value: "dripcult", label: "Dripcult" },
];

const ViewProduct = () => {
  const { id } = useParams(); // Fetch product ID from route
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (!product) {
      dispatch(getSingleProduct(id));
    }
  }, [dispatch, id, product]);

  // ...existing code...

  // Remove newImages-related code and update the form submission logic
  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      images: product?.images || [],
      sizeVariations: product?.sizeVariations || [],
      tags: product?.tags || [],
      originalPrice: product?.originalPrice || "",
      discountedPrice: product?.discountedPrice || "",
      sku: product?.sku || "",
      gender: product?.gender || "",
      category: product?.category || [],
      outOfStock: product?.outOfStock || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      originalPrice: Yup.number()
        .required("Original price is required")
        .positive("Price must be positive"),
      discountedPrice: Yup.number().positive("Price must be positive"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("originalPrice", values.originalPrice);
      formData.append("discountedPrice", values.discountedPrice);
      formData.append("sku", values.sku);
      formData.append("gender", values.gender);
      formData.append("outOfStock", values.outOfStock);

      // Convert arrays to JSON format
      values.category.forEach((cat) => formData.append("category[]", cat));
      values.tags.forEach((tag) => formData.append("tags[]", tag));
      formData.append("sizeVariations", JSON.stringify(values.sizeVariations));

      // Send deleted images
      formData.append("imagesDeleted", JSON.stringify(imagesToDelete));

      // Send new images

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      dispatch(updateProduct({ productId: id, updatedData: formData }));
    },
  });

  // ...existing code...

  const handleDeleteImage = (image) => {
    setImagesToDelete((prev) => [...prev, image]);
    formik.setFieldValue(
      "images",
      formik.values.images.filter((img) => img !== image)
    );
  };

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Add the new files to the state
    setNewImages((prev) => [...prev, ...files]);
  };

  if (loading || !product) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="p-6 w-full mx-auto bg-white rounded-md shadow-md"
    >
     <div className=" flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

     </div>
      {/* Product Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <Input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}
      </div>
      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Images</label>
        <div className="flex gap-4 flex-wrap">
          {formik.values.images.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={image}
                alt={`Product Image ${index + 1}`}
                className="w-28 h-28 object-cover rounded-md shadow-md"
              />
              <Button
                type="button"
                onClick={() => handleDeleteImage(image)}
                className="mt-2"
              >
                <MdDelete className="text-red-500" />
              </Button>
            </div>
          ))}

          {newImages.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(image)}
                alt={`New Image ${index + 1}`}
                className="w-28 h-28 object-cover rounded-md shadow-md"
              />
              <Button
                type="button"
                onClick={() =>
                  setNewImages((prev) => prev.filter((_, i) => i !== index))
                }
                className="mt-2"
              >
                <MdDelete className="text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Upload New Images
          </label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              className="bg-[#ff8f10] text-white px-4 py-2 rounded-md"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Choose Files
            </Button>
            <span className="text-sm text-gray-500">
              {newImages.length > 0
                ? `${newImages.length} New file(s) selected`
                : "No files selected"}
            </span>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleNewImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
      {/* Size Variations */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Size Variations
        </label>
        <ul>
          {formik.values.sizeVariations.map((variation, index) => (
            <li key={index} className="flex gap-4 items-center mt-2">
              <Input
                type="text"
                name={`sizeVariations[${index}].size`}
                value={variation.size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Input
                type="number"
                name={`sizeVariations[${index}].stock`}
                value={variation.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                type="button"
                onClick={() =>
                  formik.setFieldValue(
                    "sizeVariations",
                    formik.values.sizeVariations.filter((_, i) => i !== index)
                  )
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          className="mt-2"
          onClick={() =>
            formik.setFieldValue("sizeVariations", [
              ...formik.values.sizeVariations,
              { size: "", stock: 0 },
            ])
          }
        >
          Add Variation
        </Button>
      </div>
      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tags</label>
        <MultiSelect
          isMulti
          value={formik.values.tags.map((tag) => ({ label: tag, value: tag }))}
          onChange={(selected) =>
            formik.setFieldValue(
              "tags",
              selected.map((item) => item.value)
            )
          }
          options={formik.values.tags.map((tag) => ({
            label: tag,
            value: tag,
          }))}
        />
      </div>
      {/* Prices */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Original Price</label>
        <Input
          type="number"
          name="originalPrice"
          value={formik.values.originalPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.originalPrice && formik.errors.originalPrice && (
          <p className="text-red-500 text-sm">{formik.errors.originalPrice}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Discounted Price
        </label>
        <Input
          type="number"
          name="discountedPrice"
          value={formik.values.discountedPrice}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.discountedPrice && formik.errors.discountedPrice && (
          <p className="text-red-500 text-sm">
            {formik.errors.discountedPrice}
          </p>
        )}
      </div>
      {/* Categories */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Categories</label>
        <MultiSelect
          isMulti
          value={formik.values.category.map((cat) => ({
            label: cat,
            value: cat,
          }))}
          onChange={(selected) =>
            formik.setFieldValue(
              "category",
              selected.map((item) => item.value)
            )
          }
          options={categories}
        />
      </div>
      {/* Out of Stock */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Out of Stock</label>
        <Select
          onValueChange={(value) => formik.setFieldValue("outOfStock", value)}
          defaultValue={formik.values.outOfStock ? "true" : "false"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* Buttons */}
      <div className="flex gap-4">
        <Button type="submit" className="w-40">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ViewProduct;
