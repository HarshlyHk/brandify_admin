import React, { useEffect, useState } from "react";
import {
  Home,
  Settings,
  Users,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";
import { TbMoodLookUp } from "react-icons/tb";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/userSlice";
import { getCategories } from "@/features/categorySlics";
import { getTags } from "@/features/tagSlice";
import { FaUsers } from "react-icons/fa";
import { TbTruckReturn } from "react-icons/tb";
import { MdRateReview } from "react-icons/md";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RiMenu2Fill } from "react-icons/ri";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const user = useSelector((state) => state.user.user);
  console.log("User in Sidebar:", user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Users", path: "/manage-users", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Products", path: "/products/1", icon: Package },
    { name: "Orders", path: "/order/1", icon: ShoppingBag },
    { name: "Reviews", path: "/reviews/1", icon: MdRateReview },
    { name: "Categories", path: "/category", icon: Package },
    { name: "Collabos", path: "/collabos", icon: Users },
    { name: "LookBook", path: "/lookbook", icon: TbMoodLookUp },
    { name: "Special Frames", path: "/specialframe", icon: Package },
    { name: "Return/Refund", path: "/return-refund/1", icon: TbTruckReturn },
    { name: "Contact Us", path: "/contact-us/1", icon: FaUsers },
    { name: "Combos", path: "/combos", icon: Package },
    { name: "Payment Query", path: "/payment-query/1", icon: FaUsers },
  ];

  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("drip_access_token");
    navigate("/login");
  };

  // Fetch categories
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getTags());
  }, []);

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen md:w-64 bg-[white] border-r border-gray-200 flex-col shadow-sm overflow-y-auto navbar-scrollbar">
        {/* Logo Section */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div>
              <img
                src="https://pub-047aa9653e2346718393f69be234faf1.r2.dev/IMG_7330.JPG"
                alt="Drip Studios"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-base font-semibold uppercase font-helvetica text-gray-900">
                Drip Studios
              </h1>
              <p className="text-xs text-gray-500 font-helvetica">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = active === link.name;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setActive(link.name)}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  <span className="truncate">{link.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout Section */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center px-3 py-2 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium text-sm">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@drip.com"}
              </p>
            </div>
          </div>

          <button
            className="flex items-center px-3 py-2.5 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden bg-white border-b border-gray-200 w-full flex items-center justify-between px-4 h-16 shadow-sm">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger aria-label="Open menu" className="focus:outline-none">
            <RiMenu2Fill className="w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-72 bg-white p-0 overflow-auto border-r border-gray-200"
          >
            <SheetHeader className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {/* drip logo */}
                <div>
                  <img
                    src="https://pub-047aa9653e2346718393f69be234faf1.r2.dev/IMG_7330.JPG"
                    alt="Drip Studios"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <SheetTitle className="text-base font-semibold text-gray-900 text-left font-helvetica uppercase">
                    Drip Admin
                  </SheetTitle>
                  <SheetDescription className="text-xs text-gray-500 text-left font-helvetica">
                    Admin Panel
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <nav className="px-4 py-6">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = active === link.name;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => {
                        setActive(link.name);
                        setSheetOpen(false);
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 mr-3 transition-colors ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      <span className="truncate">{link.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Mobile User Profile & Logout Section */}
            <div className="px-4 py-4 border-t border-gray-100 mt-auto">
              <div className="flex items-center px-3 py-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-medium text-sm">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <button
                className="flex items-center px-3 py-2.5 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                onClick={() => {
                  handleLogout();
                  setSheetOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="https://pub-047aa9653e2346718393f69be234faf1.r2.dev/IMG_7330.JPG"
            alt="Drip Studios"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-lg font-semibold text-gray-900 uppercase font-helvetica">
            Drip Studios
          </h1>
        </div>

        {/* Mobile Quick Actions */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-xs">
              {user?.name?.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
