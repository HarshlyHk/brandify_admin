import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdDelete, MdArrowBack, MdArrowForward } from "react-icons/md";

const ProductImages = ({ formik }) => {
  const [newImages, setNewImages] = useState([]);

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...files, ...prev]); // newer images first
  };

  const handleDeleteImage = (image, isNew) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((img) => img !== image));
    } else {
      formik.setFieldValue(
        "images",
        formik.values.images.filter((img) => img !== image)
      );
    }
  };

  const moveImage = (index, direction, isNew) => {
    const list = isNew ? [...newImages] : [...formik.values.images];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= list.length) return;

    [list[index], list[newIndex]] = [list[newIndex], list[index]];

    isNew
      ? setNewImages(list)
      : formik.setFieldValue("images", list);
  };

  const renderImageBlock = (image, index, isNew = false) => (
    <div key={index} className="flex flex-col items-center">
      <img
        src={isNew ? URL.createObjectURL(image) : image}
        alt={`Product ${index + 1}`}
        className="w-28 h-28 object-cover rounded-md shadow-md"
      />
      <div className="flex gap-1 mt-2">
        <Button
          type="button"
          onClick={() => moveImage(index, -1, isNew)}
          className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded-md"
        >
          <MdArrowBack />
        </Button>
        <Button
          type="button"
          onClick={() => moveImage(index, 1, isNew)}
          className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded-md"
        >
          <MdArrowForward />
        </Button>
        <Button
          type="button"
          onClick={() => handleDeleteImage(image, isNew)}
          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md"
        >
          <MdDelete />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Images</label>
      <div className="flex gap-4 flex-wrap">
        {[...formik.values.images.map((img, i) => renderImageBlock(img, i, false)),
          ...newImages.map((img, i) => renderImageBlock(img, i, true))]}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Upload New Images</label>
        <Button
          type="button"
          className="bg-[#ff8f10] text-white px-4 py-2 rounded-md"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Choose Files
        </Button>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleNewImageUpload}
        />
      </div>
    </div>
  );
};

export default ProductImages;
