import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
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
import {
  getProducts,
  deleteProduct,
  duplicateProduct,
  updateProduct,
  updateToggleSpecial,
} from "@/features/productSlice";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlOptionsVertical } from "react-icons/sl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "../ui/skeleton";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import ReactPaginate from "react-paginate";
import axiosInstance from "@/config/axiosInstance";
import { CiSearch as AiOutlineSearch } from "react-icons/ci";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, totalProducts, totalPages, loading } = useSelector(
    (state) => state.product
  );
  const [category, setCategory] = useState("All");
  const { categories } = useSelector((state) => state.category);

  const { page } = useParams();
  const [itemsPerPage, setItemsPerPage] = useState("12");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (category != "All") {
      navigate(`/products/1`);
      dispatch(
        getProducts({
          page,
          items: itemsPerPage,
          category: `&categories=${category}`,
        })
      );
    } else {
      dispatch(getProducts({ page, items: itemsPerPage, category: "" }));
    }
  }, [dispatch, page, itemsPerPage, category]);

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
  };

  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleDuplicate = async (productId) => {
    const res = await dispatch(duplicateProduct(productId));
    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload.status === 200) {
        navigate("/products/edit/" + res.payload.data.duplicatedProduct._id);
      }
    }
  };

  const handleToggleSpecial = async (product) => {
    await dispatch(updateToggleSpecial(product._id));
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await axiosInstance.get(
        `product/admin/search?query=${searchQuery}&searchType=${searchType}`
      );
      console.log("Search Response:", response.data);
      setSearchResults(response.data.data.products);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="underline underline-offset-4 font-bold uppercase text-center sm:text-left">
          Products
        </h2>
        <div className="flex items-center gap-4">
          <AiOutlineSearch
            size={24}
            className="cursor-pointer"
            onClick={() => setSearchDialogOpen(true)}
          />
          <Link to="/products/add">
            <Button className="w-full sm:w-auto">Add Product</Button>
          </Link>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog
        open={searchDialogOpen}
        onOpenChange={() => {
          setSearchDialogOpen(false); // Correctly call the function with a value
          setSearchQuery("");
          setSearchType("name");
          setSearchResults([]);
          setSearchLoading(false);
        }}
      >
        <DialogContent className="max-w-2xl p-6 bg-white rounded-xl shadow-md">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Search Products
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <Select onValueChange={setSearchType} defaultValue={searchType}>
                <SelectTrigger className="w-full border border-gray-200 focus:ring-1 focus:ring-black rounded-md">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  <SelectGroup>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="productId">Product ID</SelectItem>
                    <SelectItem value="discountedPrice">
                      Discounted Price
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-6">
              <input
                type="text"
                placeholder="Enter search term"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="col-span-2">
              <Button
                onClick={handleSearch}
                disabled={searchLoading}
                className="w-full bg-black text-white hover:bg-gray-800 text-sm font-medium rounded-md"
              >
                {searchLoading ? (
                  <span className="flex items-center justify-center gap-1">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z"
                      />
                    </svg>
                    Searching
                  </span>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {searchResults?.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-20 text-gray-600 text-sm">
                        Image
                      </TableHead>
                      <TableHead className="text-gray-600 text-sm">
                        Name
                      </TableHead>
                      <TableHead className="text-gray-600 text-sm">
                        Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((product) => (
                      <TableRow
                        key={product._id}
                        onClick={() =>
                          navigate(`/products/edit/${product._id}`)
                        }
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell>
                          <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">
                                No Image
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-800">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          ₹{product.discountedPrice || product.originalPrice}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-500">
                  {searchLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z"
                        />
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    "No results found. Try a different search term."
                  )}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="mb-4 w-full sm:w-auto">
          <Label htmlFor="items-per-page" className="mb-2">
            Items per page:
          </Label>
          <Select
            onValueChange={(value) => setItemsPerPage(Number(value))}
            defaultValue={itemsPerPage.toString()}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 w-full sm:w-auto">
          <Label htmlFor="items-per-page" className="mb-2">
            Filter By Category
          </Label>
          <Select
            onValueChange={(value) => setCategory(value)}
            defaultValue={category}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All</SelectItem>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <SelectItem value={category?.value} key={category._id}>
                      {category?.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="overflow-x-auto">
        <TableCaption>Manage your products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Org. Price</TableHead>
            <TableHead>Disc. Price</TableHead>
            <TableHead className="text-center">Star Item</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : products.length > 0 ? (
            sortedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell
                  className="min-w-20 md:min-w-28 min-h-20 md:min-h-28 cursor-pointer"
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                >
                  <img
                    src={product?.thumbnails[0]}
                    alt={product.name}
                    className=" w-full h-full object-cover rounded-md"
                  />
                </TableCell>
                <TableCell
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                  className="cursor-pointer hover:underline max-w-[100px] md:max-w-[150px] lg:max-w-[200px] truncate text-gray-700 hover:text-gray-900 "
                >
                  {product.name}
                </TableCell>
                <TableCell>₹{product.originalPrice}</TableCell>
                <TableCell>
                  {product.discountedPrice
                    ? `₹${product.discountedPrice}`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <button onClick={() => handleToggleSpecial(product)}>
                    {product.isSpecial ? (
                      <FaStar size={20} />
                    ) : (
                      <CiStar size={20} />
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer md:block hidden hover:bg-blue-700 bg-blue-500 text-white"
                      onClick={() => navigate(`/products/edit/${product._id}`)}
                    >
                      Edit
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild className="cursor-pointer">
                        <SlOptionsVertical className="text-gray-700" />
                      </PopoverTrigger>
                      <PopoverContent className="w-48">
                        <div className="flex flex-col gap-2">
                          <Button
                            className="cursor-pointer hover:bg-green-700 bg-green-500 text-white"
                            onClick={() => {
                              handleDuplicate(product._id);
                            }}
                          >
                            Duplicate
                          </Button>
                          <Button
                            className="cursor-pointer hover:bg-blue-700 bg-blue-500 text-white"
                            onClick={() =>
                              navigate(`/products/edit/${product._id}`)
                            }
                          >
                            Edit
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="bg-red-500 text-white hover:bg-red-700 cursor-pointer">
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Product</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this product?
                                  This action cannot be undone. The Images used
                                  in this product will be removed from the
                                  database.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  className="bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                                  variant="secondary"
                                  onClick={() => handleDelete(product._id)}
                                >
                                  Confirm
                                </Button>
                                <Button variant="ghost">Cancel</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No products found. {page > 1 && "Go to page 1"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>
              <ReactPaginate
                pageCount={totalPages}
                forcePage={Number(page) - 1}
                onPageChange={(selectedItem) =>
                  navigate(`/products/${selectedItem.selected + 1}`)
                }
                marginPagesDisplayed={1} // pages at start/end
                pageRangeDisplayed={10} // pages around current
                previousLabel="Previous"
                nextLabel="Next"
                previousClassName={`text-white bg-black px-4 py-2 rounded transition-all duration-300  ${
                  page == 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } `}
                nextClassName={`text-white bg-black px-4 py-2 rounded transition-all duration-300  ${
                  page == totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } `}
                containerClassName="flex gap-4 justify-center items-center "
                activeClassName=" bg-black text-white hover:text-white text-white  rounded"
                pageClassName=" text-black "
                pageLinkClassName="hover:bg-black transition-all duration-300  hover:text-white px-4 py-2  cursor-pointer rounded"
                activeLinkClassName="bg-black text-white hover:text-white px-4 py-2 rounded"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Products;
