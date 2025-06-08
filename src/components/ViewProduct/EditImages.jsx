import React from "react";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

const EditImages = ({
  formik,
  newImages,
  handleMoveImage,
  handleDeleteImage,
  handleNewImageUpload,
  setNewImages,
}) => {
  const handleMoveNewImage = (index, direction) => {
    setNewImages((prev) => {
      const updatedImages = [...prev];
      const [movedImage] = updatedImages.splice(index, 1);
      if (direction === "up") {
        updatedImages.splice(index - 1, 0, movedImage);
      } else if (direction === "down") {
        updatedImages.splice(index + 1, 0, movedImage);
      }
      return updatedImages;
    });
  };

  return (
    <div className="mb-4">
      <label className="font-bold uppercase block mb-10">Images</label>
      <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
        {formik.values.thumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className="flex flex-col items-center relative w-40 sm:w-36"
          >
            {/* Display thumbnail */}
            <img
              src={thumbnail}
              alt={`Product Thumbnail ${index + 1}`}
              className="w-full h-40 sm:h-36 object-cover rounded-md shadow-md"
            />
            <span className="text-sm text-gray-500 mt-1">#{index + 1}</span>
            <div className="flex gap-2 mt-2">
              {/* Move operations on real images */}
              <Button
                type="button"
                className="text-white px-2 py-1 rounded-md"
                onClick={() => handleMoveImage(index, "up")}
                disabled={index === 0}
              >
                <FaArrowAltCircleLeft />
              </Button>
              <Button
                type="button"
                className="text-white px-2 py-1 rounded-md"
                onClick={() => handleMoveImage(index, "down")}
                disabled={index === formik.values.images.length - 1}
              >
                <FaArrowAltCircleRight />
              </Button>
            </div>
            {/* Delete operation on real images */}
            <Button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-[10px] absolute top-2 right-2"
            >
              <MdDelete className="text-white" />
            </Button>
          </div>
        ))}
      </div>

      {/* New Images Section */}
      {newImages.map((image, index) => (
        <div
          key={index}
          className="flex flex-col items-center relative w-40 sm:w-36"
        >
          <img
            src={URL.createObjectURL(image)}
            alt={`New Image ${index + 1}`}
            className="w-full h-40 sm:h-36 object-cover rounded-md shadow-md"
          />
          <span className="text-sm text-gray-500 mt-1">
            #{formik.values.images.length + index + 1}
          </span>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              className="text-white px-2 py-1 rounded-md"
              onClick={() => handleMoveNewImage(index, "up")}
              disabled={index === 0}
            >
              <FaArrowAltCircleLeft />
            </Button>
            <Button
              type="button"
              className="text-white px-2 py-1 rounded-md"
              onClick={() => handleMoveNewImage(index, "down")}
              disabled={index === newImages.length - 1}
            >
              <FaArrowAltCircleRight />
            </Button>
          </div>
          <Button
            type="button"
            onClick={() =>
              setNewImages((prev) => prev.filter((_, i) => i !== index))
            }
            className="mt-2 bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md absolute top-2 right-2"
          >
            <MdDelete className="text-white" />
          </Button>
        </div>
      ))}

      {/* Upload Images Section */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Upload Images
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
  );
};

export default EditImages;