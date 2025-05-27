import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MultiSelect from "react-select";
import { MdDelete } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbExternalLink } from "react-icons/tb";

const BasicInfo = ({ formik, tags, categories, id }) => {
  return (
    <>
      <div className="flex justify-center mb-10 items-center">
        <h1 className="text-xl underline underline-offset-4 font-bold">
          {formik?.values?.name}
        </h1>
        <a
          href={`https://dripdrip.in/${formik?.values?.name.replace(
            /\s+/g,
            "-"
          )}/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4"
          title="View Product"
        >
          <TbExternalLink className="text-2xl text-gray-500" />
        </a>
      </div>
      {/* Product Name */}
      <div className="flex gap-4 mb-10 w-full">
        <div className="w-1/2">
          <label className="block text-xs font-bold uppercase mb-1">
            Product Name
          </label>
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

        <div className="w-1/4">
          <label className="block text-xs font-bold uppercase  mb-1">
            Product ID
          </label>
          <Input type="text" name="sku" value={id} />
        </div>

        <div className="w-1/4">
          <label className="block text-xs font-bold uppercase  mb-1">SKU</label>
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
      </div>

      <div className="flex gap-4 mb-10 flex-wrap justify-between">
        <div className="">
          <label className="block text-xs font-bold uppercase  mb-1">
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
          <label className="block text-xs font-bold uppercase  mb-1">
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

        <div className="w-48">
          <label className="block text-xs font-bold uppercase  mb-1">
            Out of Stock
          </label>
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

        <div className="w-48">
          <label className="block text-xs font-bold uppercase  mb-1">
            UnList Item
          </label>
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

        <div className="w-48">
          <label className="block text-xs font-bold uppercase  mb-1">
            Star Item
          </label>
          {formik?.values?.isSpecial != null && (
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("isSpecial", value == "true")
              }
              value={formik?.values?.isSpecial ? "true" : "false"}
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
        {/* Preebook */}
        <div className="w-48">
          <label className="block text-xs font-bold uppercase  mb-1">
            PREBOOK Item
          </label>
          {formik?.values?.preeBook != null && (
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("preeBook", value == "true")
              }
              value={formik?.values?.preeBook ? "true" : "false"}
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

        <div className="w-48">
          <label className="block text-xs font-bold uppercase  mb-1">
            Gender
          </label>
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
        <div className="w-48">
          <label className="block text-xs font-bold uppercase  mb-1">
            On Sale
          </label>
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

      <div className="mb-10 flex flex-row-reverse gap-4">
        <div className="w-1/2">
          <label className="block text-xs font-bold uppercase  mb-1">
            Tags
          </label>
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

        <div className="w-1/2">
          <label className="block text-xs font-bold uppercase  mb-1">
            Categories
          </label>
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

      <div className="mb-10">
        <label className="block text-xs font-bold uppercase  mb-1">
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
          className="mt-2 bg-indigo-500 hover:bg-indigo-700"
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
    </>
  );
};

export default BasicInfo;
