import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { useParams, Link } from "react-router";
import { Textarea } from "../ui/textarea";
import { getSingleProduct } from "@/features/productSlice";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { FaExternalLinkAlt } from "react-icons/fa";
import CopyPromptBlock from "./CopyPromptBlock";
const BulkFakeReview = () => {
  const { productId } = useParams();
  const [reviewsData, setReviewsData] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const demoData = [
    {
      title: "Everyone loved it!",
      name: "Rohit S.",
      comment:
        "Wore this at an office get-together and literally everyone laughed when they saw the print. The fabric feels soft and premium too.",
      rating: 5,
    },
    {
      title: "Fun but delivery was slow",
      name: "Priya M.",
      comment:
        "The design is hilarious and the fit is comfortable. Took a week longer than expected to arrive though.",
      rating: 4,
    },
    {
      title: "Great quality, sizing off",
      name: "Sneha P.",
      comment:
        "Print is sharp and color is strong, but the size I ordered came a bit tight. Still wearable, just order one size up.",
      rating: 3,
    },
    {
      title: "Total conversation starter",
      name: "Amit K.",
      comment:
        "I wore this on casual Friday and even my boss cracked a smile. Great material and worth the price!",
      rating: 5,
    },
    {
      title: "Good gift idea",
      name: "Manish R.",
      comment:
        "Bought this for a friend's birthday and it was a hit. Everyone wanted to know where it's from. Definitely a fun piece to have.",
      rating: 4,
    },
  ];

  const exampleData = [
    {
      title: "Premium feel!",
      name: "Nikhil Arora",
      comment:
        "The embroidery looks super clean and neat. Doesn’t look like a cheap print at all. Totally worth the price!",
      rating: 5,
    },
    {
      title: "Delivery issue",
      name: "Sameer Joshi",
      comment:
        "The t-shirt quality is great but my order came almost 10 days late. Was planning to wear it at a concert but missed it.",
      rating: 2,
    },
  ];

  useEffect(() => {
    const getProductDetails = async () => {
      const res = await dispatch(getSingleProduct(productId));
      setProductDetails(res.payload.data.product);
    };
    getProductDetails();
  }, [dispatch, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedData = JSON.parse(reviewsData);
      if (!Array.isArray(parsedData)) {
        alert("Please provide a valid JSON array");
        return;
      }

      const response = await axiosInstance.post(
        `/review/bulk/${productId}`,
        parsedData
      );
      toast.success(
        `Successfully added ${response.data.reviewsAdded} reviews!`
      );
      setReviewsData("");
    } catch (error) {
      if (error.name === "SyntaxError") {
        toast.error("Invalid JSON format. Please check your input.");
      } else {
        console.error("Error adding bulk fake reviews:", error);
        toast.error("Error adding reviews. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setReviewsData(JSON.stringify(demoData, null, 2));
  };

  return (
    <div className="p-6  mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Add Bulk Reviews</h1>
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-xl text-gray-900">
            {productDetails?.name}
          </h3>
          <Link
            target="_blank"
            to={`https://drip-next.vercel.app/products-details/${productId}`}
            className="text-blue-500 hover:underline flex items-center justify-center gap-2 "
          >
            <FaExternalLinkAlt className="inline" />
          </Link>
        </div>
        <div>
          {productDetails?.images && productDetails?.images[0] && (
            <img
              src={productDetails?.images[0]}
              alt={productDetails?.name}
              className="w-20 h-20 object-cover rounded-sm"
            />
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Bulk Reviews</h2>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm cursor-pointer">
                  View AI prompt
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-full w-[90vw] max-h-[100vh] overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Demo Data Format
                  </h3>
                  <div className="mx-auto p-6 font-sans">
                    <h1 className="text-2xl font-bold mb-2">
                      AI Review Generator Prompt
                    </h1>
                    <p className="text-gray-500 mb-6 text-sm">
                      Use this prompt with any AI agent to generate realistic,
                      human-sounding reviews for a product based on its
                      screenshot and specs.
                    </p>
                    <CopyPromptBlock productDetails={productDetails} />

                    {/* Product Screenshot */}
                    <div className="border rounded-xl p-4 mb-6">
                      <p className="text-xs uppercase text-gray-500 mb-2">
                        Product Screenshot (optional but recommended)
                      </p>
                      {productDetails ? (
                        <img
                          src={productDetails?.images[0]}
                          alt="Product Screenshot"
                          className="rounded-lg w-[300px]"
                        />
                      ) : (
                        <p className="text-gray-400 italic">
                          No image provided
                        </p>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="border rounded-xl p-4 mt-4">
                      <p className="text-xs uppercase text-gray-500 mb-2">
                        How to Use
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>
                          Replace the image URL and the spec block with your
                          product details.
                        </li>
                        <li>
                          Paste the “Copy-Ready Prompt” into your AI tool and
                          attach the screenshot if supported.
                        </li>
                        <li>
                          Ensure the tool returns only the JSON array (no extra
                          commentary).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm cursor-pointer">
                  View Demo Data
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-full w-[80vw] max-h-[80vh] overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Demo Data Format
                  </h3>
                  <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                    {JSON.stringify(demoData, null, 2)}
                  </pre>
                  <DialogClose>
                    <button
                      onClick={loadDemoData}
                      className="mt-4 text-sm px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Use This Demo Data
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reviews Data (JSON Format)
            </label>
            <Textarea
              value={reviewsData}
              onChange={(e) => setReviewsData(e.target.value)}
              placeholder="Enter reviews data in JSON format..."
              className="w-full h-[400px] font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter an array of review objects with title, name, comment, and
              rating fields.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !reviewsData.trim()}
              className="px-6 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Reviews..." : "Add Bulk Reviews"}
            </button>

            <button
              type="button"
              onClick={loadDemoData}
              className="px-6 text-sm py-2 bg-gray-500 cursor-pointer text-white rounded-md hover:bg-gray-600"
            >
              Load Demo Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkFakeReview;
