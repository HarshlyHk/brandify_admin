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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className=" underline underline-offset-4 font-bold uppercase">
          Products
        </h2>
        <h4>
          <span className="text-sm text-gray-500">
            Total Products: {totalProducts}
          </span>
        </h4>
        <div className="flex gap-4">
          <Link to="/products/priority">
            <Button className="">Update Priority</Button>
          </Link>
          <Link to="/products/add">
            <Button className="">Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="mb-4">
          <Label htmlFor="items-per-page" className=" mb-2">
            Items per page:
          </Label>
          <Select
            onValueChange={(value) => setItemsPerPage(Number(value))}
            defaultValue={itemsPerPage.toString()}
          >
            <SelectTrigger className="w-40">
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

        <div className="mb-4">
          <Label htmlFor="items-per-page" className=" mb-2">
            Filter By Category
          </Label>
          <Select
            onValueChange={(value) => setCategory(value)}
            defaultValue={category}
          >
            <SelectTrigger className="w-40">
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

      <Table>
        <TableCaption>Manage your products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Org. Price</TableHead>
            <TableHead>Disc. Price</TableHead>
            <TableHead>Out of Stock</TableHead>
            <TableHead>Popularity</TableHead>
            <TableHead className=" text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <TableRow>
                  <TableCell key={index} colSpan={8}>
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : products.length > 0 ? (
            sortedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell
                  className="w-[100px] cursor-pointer"
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                >
                  <img
                    src={product?.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </TableCell>

                <TableCell
                  onClick={() => navigate(`/products/edit/${product._id}`)}
                  className="cursor-pointer hover:underline max-w-[200px] truncate  text-gray-700 hover:text-gray-900"
                >
                  {product.name}
                </TableCell>
                <TableCell className="uppercase truncate max-w-52">
                  {product.category.map((cat) => cat).join(", ")}
                </TableCell>

                <TableCell>₹{product.originalPrice}</TableCell>

                <TableCell>
                  {product.discountedPrice
                    ? `₹${product.discountedPrice}`
                    : "N/A"}
                </TableCell>
                <TableCell>{product.outOfStock ? "Yes" : "No"}</TableCell>
                <TableCell>{product.popularity}</TableCell>

                <TableCell className=" text-end">
                  <div className="flex gap-2 justify-center items-center">
                    <Button
                      className="cursor-pointer hover:bg-blue-700 bg-blue-500 text-white"
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
              <div className="flex justify-between items-center">
                <Button
                  className={"cursor-pointer"}
                  disabled={page == 1}
                  onClick={() => navigate(`/products/${Number(page) - 1}`)}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                      key={index + 1}
                      className={`cursor-pointer ${
                        Number(page) === index + 1
                          ? "bg-black text-white"
                          : " bg-white text-black hover:text-white"
                      }`}
                      onClick={() => navigate(`/products/${index + 1}`)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  className="cursor-pointer"
                  disabled={page == totalPages}
                  onClick={() => navigate(`/products/${Number(page) + 1}`)}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Products;
