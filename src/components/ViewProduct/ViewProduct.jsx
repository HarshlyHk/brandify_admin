import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleProduct,
  reorderedImage,
  updateProduct,
} from "@/features/productSlice";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import DraftViewer from "./DraftViewer";
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
      thumbnails: product?.thumbnails || [],
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
      specialSale: product?.specialSale,
      specialSaleDiscount: product?.specialSaleDiscount || 0,
      isFastDelivery: product?.isFastDelivery,
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
      formData.append("specialSale", values.specialSale);
      formData.append("specialSaleDiscount", values.specialSaleDiscount);
      formData.append("isFastDelivery", values.isFastDelivery);
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
    const thumbnails = [...formik.values.thumbnails];

    if (direction === "up" && index > 0) {
      // Swap images and thumbnails with the previous item
      [images[index - 1], images[index]] = [images[index], images[index - 1]];
      [thumbnails[index - 1], thumbnails[index]] = [
        thumbnails[index],
        thumbnails[index - 1],
      ];
    } else if (direction === "down" && index < images.length - 1) {
      // Swap images and thumbnails with the next item
      [images[index], images[index + 1]] = [images[index + 1], images[index]];
      [thumbnails[index], thumbnails[index + 1]] = [
        thumbnails[index + 1],
        thumbnails[index],
      ];
    }

    formik.setFieldValue("images", images);
    formik.setFieldValue("thumbnails", thumbnails);
  };

  const handleDeleteImage = (index) => {
    console.log("Formik Images Before Deletion:", formik.values.images); // ← this matters
    console.log("Deleting index:", index);

    const images = [...formik.values.images];
    const thumbnails = [...formik.values.thumbnails];

    const imageToDelete = images[index];
    if (!imageToDelete) {
      console.warn("No image found at index", index);
      return;
    }

    images.splice(index, 1);
    thumbnails.splice(index, 1);

    formik.setFieldValue("images", images);
    formik.setFieldValue("thumbnails", thumbnails);

    setImagesToDelete((prev) => [...prev, imageToDelete]);
  };

  const handleNewImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const resizeImage = (file) => {
      return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas dimensions for resizing
            const MAX_WIDTH = 450;
            const MAX_HEIGHT = 450;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = (height * MAX_WIDTH) / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = (width * MAX_HEIGHT) / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                resolve(new File([blob], file.name, { type: file.type }));
              },
              file.type,
              0.8
            ); // Adjust quality if needed
          };
        };

        reader.readAsDataURL(file);
      });
    };

    const resizedImagesPromises = files.map((file) => resizeImage(file));

    Promise.all(resizedImagesPromises).then((resizedImages) => {
      setNewImages((prev) => [...prev, ...files]);
    });
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
