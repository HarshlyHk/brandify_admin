import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProductDetails from "./ProductDetails";
import ProductTagsAndCategories from "./ProductTagsAndCategories";
import SizeVariations from "./SizeVariations";
import ProductImages from "./ProductImages";
import RichTextEditors from "./RichTextEditors";

const ProductForm = ({ product, categories, tags, onSubmit }) => {
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
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-6 w-full mx-auto bg-white rounded-md">
      <ProductDetails formik={formik} />
      <ProductTagsAndCategories formik={formik} categories={categories} tags={tags} />
      <SizeVariations formik={formik} />
      <ProductImages formik={formik} />
      <RichTextEditors formik={formik} />
      <div className="flex gap-4 justify-end fixed bottom-4 right-4">
        <button type="submit" className="w-40 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 text-white">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProductForm;