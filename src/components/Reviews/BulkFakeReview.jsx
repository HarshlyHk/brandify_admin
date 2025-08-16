import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { useParams } from "react-router";
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

  useEffect(() => {
    const getProductDetails = async () => {
      const res = await dispatch(getSingleProduct(productId));
      console.log(res.payload.data.product);
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
      console.log("Bulk fake reviews added:", response.data);
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bulk Fake Reviews</h1>

      {/* Product Details */}
      {productDetails && (
        <div className="bg-white p-6 mb-6">
          <div className="flex items-center gap-4">
            {productDetails.images && productDetails.images[0] && (
              <img
                src={productDetails.images[0]}
                alt={productDetails.name}
                className="w-20 h-20 object-cover rounded-sm"
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                {productDetails.name}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Bulk Reviews</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                View Demo Data
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-full w-[80vw] max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Demo Data Format</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(demoData, null, 2)}
                </pre>
                <DialogClose>
                  <button
                    onClick={loadDemoData}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Use This Demo Data
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
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
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Reviews..." : "Add Bulk Reviews"}
            </button>

            <button
              type="button"
              onClick={loadDemoData}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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
