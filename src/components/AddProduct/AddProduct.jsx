import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { MdDelete } from "react-icons/md";
import { createProduct } from "@/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import MultiSelect from "react-select";
const categories = [
  { value: "oversizeTees", label: "Oversize Tees" },
  { value: "vest", label: "Vest" },
  { value: "hoodies", label: "Hoodies" },
  { value: "bottoms", label: "Bottoms" },
  { value: "blanks", label: "Blanks" },
  { value: "dripcult", label: "Dripcult" },
];

const AddProduct = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      originalPrice: "",
      discountedPrice: "",
      category: [],
      sku: "",
      gender: "",
      tags: "",
      sizeVariations: JSON.stringify([
        { size: "S", stock: "10" },
        { size: "M", stock: "10" },
        { size: "L", stock: "10" },
      ]),
      outOfStock: false,
      colorVariations: "",
      images: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      originalPrice: Yup.number()
        .required("Original price is required")
        .positive("Price must be positive"),
      discountedPrice: Yup.number()
        .positive("Discounted price must be positive")
        .nullable(),
      category: Yup.array()
        .min(1, "At least one category is required")
        .required("Category is required"),

      gender: Yup.string().required("Gender is required"),
      tags: Yup.string().required("Tags are required"),
      images: Yup.mixed().required("At least one image is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();

      // Append all form fields to FormData
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("originalPrice", values.originalPrice);
      formData.append("discountedPrice", values.discountedPrice || "");
      formData.append("category", values.category.join(","));
      formData.append("sku", values.sku);
      formData.append("gender", values.gender);
      formData.append("tags", values.tags);
      formData.append("sizeVariations", values.sizeVariations);
      formData.append("colorVariations", values.colorVariations || "");

      // Append images to FormData
      if (values.images) {
        values.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      console.log("Form Data:", formData);

      // Dispatch the action with FormData
      dispatch(createProduct(formData));
    },
  });

  const [sizeVariations, setSizeVariations] = useState([
    { size: "S", stock: "10" },
    { size: "M", stock: "10" },
    { size: "L", stock: "10" },
  ]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleSizeChange = (index, field, value) => {
    const updatedVariations = [...sizeVariations];
    updatedVariations[index][field] = value;
    setSizeVariations(updatedVariations);
    formik.setFieldValue("sizeVariations", JSON.stringify(updatedVariations));
  };

  const addSizeVariation = () => {
    setSizeVariations([...sizeVariations, { size: "", stock: "" }]);
  };

  const removeSizeVariation = (index) => {
    const updatedVariations = sizeVariations.filter((_, i) => i !== index);
    setSizeVariations(updatedVariations);
    formik.setFieldValue("sizeVariations", JSON.stringify(updatedVariations));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    formik.setFieldValue("images", files);

    // Generate previews
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Update the formik images field
    const updatedFiles = updatedPreviews.map((preview) => preview.file);
    formik.setFieldValue("images", updatedFiles);
  };

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Product Name */}
        <div className="flex  gap-8">
          <div className="mb-8">
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <Input
              type="text"
              name="name"
              className="w-60"
              placeholder="Enter product name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm ">{formik.errors.name}</p>
            )}
          </div>
          {/* Original Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Original Price
            </label>
            <Input
              type="number"
              name="originalPrice"
              placeholder="Original price"
              value={formik.values.originalPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.originalPrice && formik.errors.originalPrice && (
              <p className="text-red-500 text-sm">
                {formik.errors.originalPrice}
              </p>
            )}
          </div>

          {/* Discounted Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Discounted Price
            </label>
            <Input
              type="number"
              name="discountedPrice"
              placeholder="Discounted price"
              value={formik.values.discountedPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.discountedPrice &&
              formik.errors.discountedPrice && (
                <p className="text-red-500 text-sm">
                  {formik.errors.discountedPrice}
                </p>
              )}
          </div>
          {/* SKU */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">SKU</label>
            <Input
              type="text"
              name="sku"
              placeholder="Enter SKU"
              className="w-48"
              value={formik.values.sku}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.sku && formik.errors.sku && (
              <p className="text-red-500 text-sm">{formik.errors.sku}</p>
            )}
          </div>
          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gender</label>
            <Select
              name="gender"
              onValueChange={(value) => formik.setFieldValue("gender", value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gender</SelectLabel>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm">{formik.errors.gender}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            type="text"
            name="description"
            placeholder="Enter product description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 absolute text-sm">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-4 gap-4"></div>
        <div className="flex gap-10">
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium mb-1">Category</label>
            <MultiSelect
              isMulti
              name="category"
              options={categories}
              className="basic-multi-select w-full"
              classNamePrefix="select"
              onChange={(selectedOptions) =>
                formik.setFieldValue(
                  "category",
                  selectedOptions.map((option) => option.value)
                )
              }
            />
          </div>
          {/* Tags */}
          <div className=" w-full">
            <label className="block text-sm font-medium mb-1">Tags</label>
            <Input
              type="text"
              name="tags"
              placeholder="Enter tags (comma-separated)"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.tags && formik.errors.tags && (
              <p className="text-red-500 text-sm">{formik.errors.tags}</p>
            )}
          </div>
        </div>

        {/* Size Variations */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Size Variations
          </label>
          {sizeVariations.map((variation, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <Input
                type="text"
                placeholder="Size (e.g., S, M, L)"
                value={variation.size.toUpperCase()}
                className=" uppercase"
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
              />
              <Input
                type="number"
                placeholder="Stock"
                value={variation.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
              />
              <Button
                type="button"
                className="text-red-500"
                onClick={() => removeSizeVariation(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addSizeVariation}>
            Add Size Variation
          </Button>
        </div>

        {/* Color Variations */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Color Variations
          </label>
          <Input
            type="text"
            name="colorVariations"
            placeholder='Enter color variations as JSON (e.g., [{"color":"Red","image":"url","stock":5}])'
            value={formik.values.colorVariations}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.colorVariations && formik.errors.colorVariations && (
            <p className="text-red-500 text-sm">
              {formik.errors.colorVariations}
            </p>
          )}
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Images</label>
          <Input
            type="file"
            name="images"
            multiple
            className="border border-gray-700 border-dashed cursor-pointer rounded-md h-fit p-10"
            onChange={handleImageChange}
          />
          {formik.touched.images && formik.errors.images && (
            <p className="text-red-500 text-sm">{formik.errors.images}</p>
          )}
        </div>
        {imagePreviews.length === 0 ? (
          <p className="text-gray-500">No images selected</p>
        ) : (
          <p className="text-gray-500">Preview of Images:</p>
        )}
        <div className="mt-4 flex gap-4 flex-wrap mb-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                className="w-28 h-28 object-cover rounded-md shadow-md"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1  cursor-pointer"
                onClick={() => removeImage(index)}
              >
                <MdDelete size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              Adding Product...
            </div>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
