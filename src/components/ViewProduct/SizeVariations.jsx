import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";

const SizeVariations = ({ formik }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Size Variations</label>
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
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md"
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
  );
};

export default SizeVariations;