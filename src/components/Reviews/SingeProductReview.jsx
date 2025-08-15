import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductReviews,
  setPage,
  setLimit,
  setSort,
  addFakeReview,
} from "@/features/reviewSlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";
import ReactPaginate from "react-paginate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

const limitOptions = [5, 10, 20, 50];

const SingeProductReview = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const {
    reviews,
    myreview,
    total,
    totalPages,
    page,
    limit,
    loading,
    sort,
    productDetail,
  } = useSelector((state) => state.review);

  const [selectedReview, setSelectedReview] = useState(null);
  const [fakeDialogOpen, setFakeDialogOpen] = useState(false);
  const [fakeName, setFakeName] = useState("");
  const [fakeComment, setFakeComment] = useState("");
  const [fakeTitle, setFakeTitle] = useState("");
  const [fakeRating, setFakeRating] = useState(0);
  const [fakeLoading, setFakeLoading] = useState(false);

  useEffect(() => {
    dispatch(getProductReviews({ productId, page, limit, sort }));
  }, [dispatch, productId, page, limit, sort]);
  const handlePageChange = (selectedItem) => {
    dispatch(setPage(selectedItem.selected + 1));
  };

  const handleAddFakeReview = async () => {
    if (!fakeName || !fakeComment || !fakeRating) {
      toast.error("All fields are required.");
      return;
    }
    if (fakeComment.length > 500) {
      toast.error("Comment must be 500 characters or less.");
      return;
    }
    setFakeLoading(true);
    try {
      await dispatch(
        addFakeReview({
          productId,
          name: fakeName,
          comment: fakeComment,
          rating: fakeRating,
          title: fakeTitle,
        })
      ).unwrap();
      setFakeDialogOpen(false);
      setFakeName("");
      setFakeComment("");
      setFakeRating(0);
      // No need to refetch, review is appended in slice
    } catch (err) {
      // Error toast already handled in slice
    } finally {
      setFakeLoading(false);
    }
  };

  // Helper to render stars
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-500 inline-block mr-2" />
      ) : (
        <FaRegStar key={i} className="text-gray-300 inline-block" />
      )
    );

  return (
    <div className="p-6">
      <h2 className="underline underline-offset-4 font-bold text-lg uppercase text-left">
        Product Reviews
      </h2>
      <div className="flex flex-col sm:flex-row justify-between items-start my-4">
        <div>
          <h3 className="font-semibold">{productDetail?.name}</h3>
          {productDetail?.thumbnail && (
            <img
              src={productDetail.thumbnail}
              alt={productDetail.name}
              className="mt-2 w-24 h-24 object-cover rounded-md"
            />
          )}
        </div>
        <div>
          <div className="flex gap-4">
            <Select
              onValueChange={(value) => dispatch(setLimit(Number(value)))}
              defaultValue={limit.toString()}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {limitOptions.map((l) => (
                    <SelectItem value={l.toString()} key={l}>
                      {l} per page
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => dispatch(setSort(value))}
              defaultValue={sort}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {sortOptions.map((opt) => (
                    <SelectItem value={opt.value} key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              className="bg-green-600 text-white hover:bg-green-800"
              onClick={() => setFakeDialogOpen(true)}
            >
              Add Fake Review
            </Button>
          </div>
          <div className=" text-sm mt-4 text-end">Total Reviews: {total}</div>
          <div className=" text-sm mt-4 text-end">Average Rating: {productDetail?.averageRating}</div>
        </div>
      </div>

      <Table className="overflow-x-auto">
        <TableCaption>All reviews for this product</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: limit }, (_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell>
                  {review.name || review.user?.name || "User"}
                </TableCell>
                <TableCell className="">{renderStars(review.rating)}</TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {review.comment}
                </TableCell>
                <TableCell>{review.title ? review.title : "N/A"}</TableCell>
                <TableCell>
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-700"
                    onClick={() => setSelectedReview(review)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No reviews found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <ReactPaginate
                pageCount={totalPages}
                forcePage={page - 1}
                onPageChange={handlePageChange}
                marginPagesDisplayed={1}
                pageRangeDisplayed={5}
                previousLabel="Previous"
                nextLabel="Next"
                previousClassName={`text-white bg-black px-4 py-2 rounded ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                nextClassName={`text-white bg-black px-4 py-2 rounded ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                containerClassName="flex gap-4 justify-center items-center"
                activeClassName="bg-black text-white rounded"
                pageClassName="text-black"
                pageLinkClassName="hover:bg-black hover:text-white px-4 py-2 cursor-pointer rounded"
                activeLinkClassName="bg-black text-white px-4 py-2 rounded"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Dialog for full review */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Review Details
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <div className="space-y-4">
                  <div className=" flex gap-2 items-center">
                    <div>
                      {selectedReview.name ||
                        selectedReview.user?.name ||
                        "User"}
                    </div>
                    <div className="text-sm text-blue-500">
                      {selectedReview.certifiedBuyer
                        ? " - Certified Buyer"
                        : ""}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {renderStars(selectedReview.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedReview.rating} Stars
                    </span>
                  </div>
                </div>
                <div>
                  <img
                    src={productDetail.thumbnail}
                    alt={selectedReview.title}
                    className="w-20 h-auto rounded-lg"
                  />
                </div>
              </div>
              <div className="border-t py-4">
                <div className="mt-1 text-gray-700 text-sm font-semibold break-words">
                  {selectedReview.title}
                </div>
                <div className="mt-1 text-gray-700 text-sm break-words">
                  {selectedReview.comment}
                </div>
              </div>

              <div className="text-sm">
                {selectedReview.createdAt
                  ? new Date(selectedReview.createdAt).toLocaleString()
                  : ""}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for adding fake review */}
      <Dialog
        open={fakeDialogOpen}
        onOpenChange={() => setFakeDialogOpen(false)}
      >
        <DialogContent className="max-w-lg p-6 bg-white rounded-xl shadow-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Add Fake Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="block mb-1">Title</Label>
              <Input
                type="text"
                value={fakeTitle}
                onChange={(e) => setFakeTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={100}
                placeholder="Enter the title (optional)"
              />
            </div>
            <div>
              <Label className="block mb-1">Name</Label>
              <Input
                type="text"
                value={fakeName}
                onChange={(e) => setFakeName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                maxLength={100}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label className="font-semibold block mb-1">Comment</Label>
              <Textarea
                value={fakeComment}
                onChange={(e) => {
                  if (e.target.value.length <= 500)
                    setFakeComment(e.target.value);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 min-h-40"
                maxLength={500}
                placeholder="Review comment (max 500 characters)"
              />
              <p className="text-muted-foreground text-xs text-end w-full mt-2">
                {fakeComment.length}/500
              </p>
            </div>
            <div>
              <Label className="font-semibold block mb-1">Rating</Label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="focus:outline-none cursor-pointer"
                    onClick={() => setFakeRating(i + 1)}
                  >
                    {i < fakeRating ? (
                      <FaStar className="text-yellow-500 text-xl" />
                    ) : (
                      <FaRegStar className="text-gray-300 text-xl" />
                    )}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">{fakeRating}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-green-600 text-white hover:bg-green-800"
                onClick={handleAddFakeReview}
                disabled={fakeLoading}
              >
                {fakeLoading ? "Adding..." : "Add Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingeProductReview;
