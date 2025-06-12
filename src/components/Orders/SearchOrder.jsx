import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";
import { IoSearch, IoClose } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";

const SearchOrder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const searchOptions = [
    { value: "order_id", label: "Order ID" },
    { value: "email", label: "Email" },
    { value: "phoneNumber", label: "Phone" },
    { value: "userId", label: "User ID" },
    { value: "name", label: "Name" },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(false);

    try {
      const response = await axiosInstance.get(
        "/orders/admin/get-user-orders",
        {
          params: { [searchType]: searchQuery },
        }
      );
      setResults(response.data?.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const getPlaceholder = () => {
    const option = searchOptions.find((opt) => opt.value === searchType);
    return `Search by ${option?.label}...`;
  };

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500); // Adjust debounce delay as needed

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, searchType]);

  // Navigate to order details on click
  const handleResultClick = (orderId) => {
    navigate(`/orders/${orderId}`);
    clearSearch();
  };

  return (
    <div className="relative mx-auto ">
      <form className="flex gap-2">
        <div className="relative flex-1">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden px-2 w-[400px]">
            <div className="pointer-events-none text-gray-400">
              <IoSearch size={18} />
            </div>
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2 pr-2 h-11 focus:ring-0 outline-none text-xs"
            />
            <div className="w-36">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-11 border-none shadow-none outline-0 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-[140px] text-xs">
                  <SelectGroup>
                    {searchOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className={"text-xs"}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IoClose size={18} />
            </button>
          )}
        </div>
      </form>

      {loading && (
        <div className="mt-3 space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {showDropdown && (
        <div className="absolute w-full z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto text-xs">
              {results.map((order) => (
                <div
                  key={order._id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(order._id)}
                >
                  <div className="grid grid-cols-3 gap-3 items-center">
                    {/* Name */}
                    <p className="text-xs font-medium text-gray-900 truncate w-[150px]">
                      {order.shippingAddress?.fullName || "No Name"}
                    </p>

                    {/* Date */}
                    <p className="text-xs font-medium text-gray-900 text-center w-[120px]">
                      {new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(new Date(order?.createdAt)) || "No Date"}
                    </p>

                    {/* Price */}
                    <p className="text-xs text-gray-900 text-right">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">
                No orders found. Try a different search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOrder;
