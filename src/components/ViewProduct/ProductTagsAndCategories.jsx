import React from "react";
import MultiSelect from "react-select";

const ProductTagsAndCategories = ({ formik, categories, tags }) => {
  return (
    <div className="mb-4 flex flex-row-reverse gap-4">
      <div className="w-1/2">
        <label className="block text-sm font-medium mb-1">Tags</label>
        <MultiSelect
          isMulti
          value={formik.values.tags.map((tag) => ({ label: tag, value: tag }))}
          onChange={(selected) =>
            formik.setFieldValue("tags", selected.map((item) => item.value))
          }
          options={tags.map((tag) => ({ label: tag.label, value: tag.value }))}
        />
      </div>
      <div className="w-1/2">
        <label className="block text-sm font-medium mb-1">Categories</label>
        <MultiSelect
          isMulti
          value={formik.values.category.map((cat) => ({ label: cat, value: cat }))}
          onChange={(selected) =>
            formik.setFieldValue("category", selected.map((item) => item.value))
          }
          options={categories}
        />
      </div>
    </div>
  );
};

export default ProductTagsAndCategories;