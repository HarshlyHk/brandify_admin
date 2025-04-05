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
import DraftViewer from "./DraftViewer";

const ViewProduct = () => {
  const { id } = useParams(); // Fetch product ID from route
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tags);
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
      images: product?.images || [],
      sizeVariations: product?.sizeVariations || [],
      tags: product?.tags || [],
      originalPrice: product?.originalPrice || "",
      discountedPrice: product?.discountedPrice || "",
      sku: product?.sku || "",
      gender: product?.gender || "",
      category: product?.category || [],
      outOfStock: product?.outOfStock,
      unlist: product?.unlist,
      onSale: product?.onSale,
      shortDescription: product?.shortDescription,
      coreFeatures: product?.coreFeatures,
      description: product?.description,
      careGuide: product?.careGuide,
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
      formData.append("originalPrice", values.originalPrice);
      formData.append("discountedPrice", values.discountedPrice);
      formData.append("sku", values.sku);
      formData.append("gender", values.gender);
      formData.append("outOfStock", values.outOfStock);
      formData.append("unlist", values.unlist);
      formData.append("onSale", values.onSale);
      formData.append("careGuide", values.careGuide);
      formData.append("description", values.description);
      formData.append("shortDescription", values.shortDescription);
      formData.append("coreFeatures", values.coreFeatures);

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
      className="p-6 w-full mx-auto bg-white rounded-md"
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
      <div className="flex gap-4 mb-4">
        <div className="">
          <label className="block text-sm font-medium mb-1">
            Original Price
          </label>
          <Input
            type="number"
            name="originalPrice"
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
        <div className="">
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

        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Out of Stock</label>
          {formik?.values?.outOfStock != null && (
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("outOfStock", value == "true")
              }
              value={formik?.values?.outOfStock ? "true" : "false"}
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
          )}
        </div>

        {/* unlist */}

        <div className="w-40">
          <label className="block text-sm font-medium mb-1">UnList Item</label>
          {formik?.values?.unlist != null && (
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("unlist", value == "true")
              }
              value={formik?.values?.unlist ? "true" : "false"}
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
          )}
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium mb-1">Gender</label>
          {formik?.values?.gender !== "" && (
            <Select
              value={formik?.values?.gender}
              onValueChange={(value) => formik.setFieldValue("gender", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium mb-1">On Sale</label>
          {formik?.values?.onSale != null && (
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("onSale", value === "true")
              }
              value={formik?.values?.onSale ? "true" : "false"}
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
          )}
        </div>
      </div>

      {/* On Sale */}

      {/* SKU */}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">SKU</label>
        <Input
          type="text"
          name="sku"
          value={formik.values.sku}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.sku && formik.errors.sku && (
          <p className="text-red-500 text-sm">{formik.errors.sku}</p>
        )}
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-row-reverse gap-4">
        <div className=" w-1/2">
          <label className="block text-sm font-medium mb-1">Tags</label>
          <MultiSelect
            isMulti
            value={formik.values.tags.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            onChange={(selected) =>
              formik.setFieldValue(
                "tags",
                selected.map((item) => item.value)
              )
            }
            options={tags.map((tag) => ({
              label: tag.label,
              value: tag.value,
            }))}
            className="basic-multi-select"
          />
        </div>

        <div className=" w-1/2">
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
                className={
                  "bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md"
                }
                onClick={() =>
                  formik.setFieldValue(
                    "sizeVariations",
                    formik.values.sizeVariations.filter((_, i) => i !== index)
                  )
                }
              >
                <MdDelete className="text-white" />
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

      {/* Images */}

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
                className="mt-2 bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md"
              >
                <MdDelete className="text-white" />
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
                className="mt-2 bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md"
              >
                <MdDelete className="text-white" />
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

      {/* Description */}
      {formik.values.description && (

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <DraftViewer
          value={formik.values.description}
          onChange={(value) => formik.setFieldValue("description", value)}
        />
      </div>
      )}

      {formik.values.shortDescription && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Short Description
          </label>
          <DraftViewer
            value={formik.values.shortDescription}
            onChange={(value) =>
              formik.setFieldValue("shortDescription", value)
            }
          />
        </div>
      )}

      {/* Core Features */}
      {formik.values.coreFeatures && (

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Core Features</label>
        <DraftViewer
          value={formik.values.coreFeatures}
          onChange={(value) => formik.setFieldValue("coreFeatures", value)}
        />
      </div>
      )}

      {/* Care Guide */}
      {formik.values.careGuide &&  
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Care Guide</label>
        <DraftViewer
          value={formik.values.careGuide}
          onChange={(value) => formik.setFieldValue("careGuide", value)}
        />
      </div>
      }

      <div className="flex gap-4 justify-end fixed bottom-4 right-4">
        <Button
          type="submit"
          className="w-40 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ViewProduct;
