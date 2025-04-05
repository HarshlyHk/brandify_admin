import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

const ProductDetails = ({ formik }) => {
  return (
    <div>
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
        <div>
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
        <div>
          <label className="block text-sm font-medium mb-1">Discounted Price</label>
          <Input
            type="number"
            name="discountedPrice"
            value={formik.values.discountedPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.discountedPrice && formik.errors.discountedPrice && (
            <p className="text-red-500 text-sm">{formik.errors.discountedPrice}</p>
          )}
        </div>
        {/* Add other fields like Out of Stock, Gender, etc. */}
      </div>
    </div>
  );
};

export default ProductDetails;