import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleProduct,
  reorderedImage,
  updateProduct,
} from "@/features/productSlice";
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
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import BasicInfo from "./BasicInfo";
import EditImages from "./EditImages";

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
      isSpecial: product?.isSpecial,
      preeBook: product?.preeBook,
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
      formData.append("isSpecial", values.isSpecial);
      formData.append("preeBook", values.preeBook);

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

  const handleMoveImage = (index, direction) => {
    const images = [...formik.values.images];
    if (direction === "up" && index > 0) {
      // Swap with the previous image
      [images[index - 1], images[index]] = [images[index], images[index - 1]];
    } else if (direction === "down" && index < images.length - 1) {
      // Swap with the next image
      [images[index], images[index + 1]] = [images[index + 1], images[index]];
    }
    formik.setFieldValue("images", images);
  };

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
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleReorderSubmit = () => {
    const reorderedImages = formik.values.images;
    dispatch(reorderedImage({ productId: id, images: reorderedImages }));
  };

  if (loading || !product) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full mx-auto bg-white rounded-md"
    >
      <div className="p-6">
        <BasicInfo
          formik={formik}
          tags={tags}
          categories={categories}
          id={id}
        />

        <div className="my-10">
          <hr />
        </div>

        <EditImages
          formik={formik}
          newImages={newImages}
          handleMoveImage={handleMoveImage}
          handleDeleteImage={handleDeleteImage}
          handleNewImageUpload={handleNewImageUpload}
          setNewImages={setNewImages}
        />

        <div className="my-10">
          <hr />
        </div>
        {/*  Description */}

        <div className="mb-4">
          <label className="block font-bold uppercase  mb-4">Description</label>
          {formik.values.description !== undefined && (
            <DraftViewer
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue("description", value)}
            />
          )}
        </div>
        <div className="my-4">
          <hr />
        </div>

        {/* Short Description */}
        <div className="mb-4">
          <label className="block font-bold uppercase  mb-4">
            Short Description
          </label>
          {formik.values.shortDescription !== undefined && (
            <DraftViewer
              value={formik.values.shortDescription}
              onChange={(value) =>
                formik.setFieldValue("shortDescription", value)
              }
            />
          )}
        </div>

        <div className="my-10">
          <hr />
        </div>

        {/* Core Features */}
        <div className="mb-4">
          <label className="block font-bold uppercase  mb-4">
            Core Features
          </label>
          {formik.values.coreFeatures !== undefined && (
            <DraftViewer
              value={formik.values.coreFeatures}
              onChange={(value) => formik.setFieldValue("coreFeatures", value)}
            />
          )}
        </div>

        <div className="my-10">
          <hr />
        </div>

        {/* Care Guide */}
        <div className="mb-4">
          <label className="block font-bold uppercase  mb-4">Care Guide</label>
          {formik.values.careGuide !== undefined && (
            <DraftViewer
              value={formik.values.careGuide}
              onChange={(value) => formik.setFieldValue("careGuide", value)}
            />
          )}
        </div>
      </div>
      <div className="flex gap-4 justify-end sticky -bottom-4 p-2 h-14 bg-[white] backdrop-blur-2xl w-full border-t-2 border-t-gray-200">
        <Button
          type="button"
          className="w-40 bg-green-600 hover:bg-green-700 text-white"
          onClick={handleReorderSubmit}
        >
          Save Image Order
        </Button>
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
