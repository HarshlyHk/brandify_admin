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

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="underline underline-offset-4 font-bold uppercase text-center sm:text-left">
          Products
        </h2>
        <h4 className="mt-2 sm:mt-0">
          <span className="text-sm text-gray-500">
            Total Products: {totalProducts}
          </span>
        </h4>
        <div className="flex flex-col sm:flex-row gap-4 mt-2 sm:mt-0">
          <Link to="/products/priority">
            <Button className="w-full sm:w-auto">Update Priority</Button>
          </Link>
          <Link to="/products/add">
            <Button className="w-full sm:w-auto">Add Product</Button>
          </Link>
        </div>
      </div>

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
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className=" mt-4 md:mt-2">
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
      </div>
    </div>
  );
};

export default Products;
