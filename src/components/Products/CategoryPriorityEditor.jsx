import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
  getAllProductsByPriority,
  updateBulkPriority,
} from "@/features/productSlice";
import { Label } from "../ui/label";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableRow = ({ product, index, handleNavigate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell
        className="w-[100px] cursor-pointer"
        // onClick={() => handleNavigate(product._id)}
      >
        <img
          src={product?.thumbnails[0]}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      </TableCell>
      <TableCell
        onClick={() => handleNavigate(product._id)}
        className="cursor-pointer hover:underline max-w-[200px] truncate text-gray-700 hover:text-gray-900"
      >
        {product.name}
      </TableCell>
      <TableCell className="uppercase truncate max-w-52">
        {product.order}
      </TableCell>
    </TableRow>
  );
};

const CategoryPriorityEditor = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("oversized-tees");
  const [products, setProducts] = useState([]);
  const { productsByPriority, loading } = useSelector((state) => state.product);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    dispatch(getAllProductsByPriority(category));
  }, [dispatch, category]);

  useEffect(() => {
    setProducts(productsByPriority);
  }, [productsByPriority]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = products.findIndex(
        (product) => product._id === active.id
      );
      const newIndex = products.findIndex((product) => product._id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);
      setProducts(newProducts);
    }
  };

  const handleSavePriorities = () => {
    const payload = {
      category,
      products: products.map((product, index) => ({
        productId: product._id,
        order: index + 1,
      })),
    };

    dispatch(updateBulkPriority(payload)); // PATCH request
  };

  const handleNavigate = (productId) => {
    // Navigate to product edit page
    console.log(`Navigate to product ${productId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="underline underline-offset-4 font-bold uppercase">
          Products
        </h2>
        <div className="flex gap-4 ">
          <Button
            onClick={handleSavePriorities}
            className=" bg-orange-600 hover:bg-orange-600"
          >
            Save Priorities
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="category" className="mb-2">
          Select Category
        </Label>
        <Select
          onValueChange={(value) => setCategory(value)}
          defaultValue={category}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="oversized-tees">Oversized Tees</SelectItem>
              <SelectItem value="hoodies">Hoodies</SelectItem>
              <SelectItem value="bottoms">Bottoms</SelectItem>
              <SelectItem value="vest">Vest</SelectItem>
              <SelectItem value="dripcult">Drip Cult</SelectItem>
              <SelectItem value="fear-no-one">Fear No One</SelectItem>
              <SelectItem value="blanks">Blanks</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((product) => product._id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableCaption>Manage your products</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>S No.</TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Priority Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                products.map((product, index) => (
                  <SortableRow
                    key={product._id}
                    product={product}
                    index={index}
                    handleNavigate={handleNavigate}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CategoryPriorityEditor;
