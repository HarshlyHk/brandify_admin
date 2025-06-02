import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setPage, setLimit } from "@/features/manageUser";
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
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, total, loading, page, limit, totalPages } = useSelector(
    (state) => state.manageUser
  );
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(limit);

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: itemsPerPage }));
  }, [dispatch, page, itemsPerPage]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: itemsPerPage }));
  }, [dispatch, page, itemsPerPage]);
  
  const handleLimitChange = (value) => {
    setItemsPerPage(Number(value));
    dispatch(setLimit(Number(value)));
    dispatch(setPage(1));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <h4>
          <span className="text-sm text-gray-700">Total Users: {total}</span>
        </h4>
      </div>
      <div className="mb-4">
        <Label htmlFor="items-per-page" className="mb-2">
          Items per page:
        </Label>
        <Select
          onValueChange={handleLimitChange}
          defaultValue={itemsPerPage.toString()}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption>Manage your users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <>
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="py-6">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <ReactPaginate
                pageCount={totalPages}
                forcePage={Number(page) - 1}
                onPageChange={(selectedItem) =>
                  dispatch(setPage(selectedItem.selected + 1))
                }
                marginPagesDisplayed={1} // pages at start/end
                pageRangeDisplayed={10} // pages around current
                previousLabel="Previous"
                nextLabel="Next"
                previousClassName={`text-white bg-black px-4 py-2 rounded transition-all duration-300  ${
                  page == 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
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

export default ManageUsers;
