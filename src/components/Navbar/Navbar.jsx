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
import { useDispatch } from "react-redux";
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
      <div className="hidden md:flex h-screen md:w-64 bg-gray-900 text-white flex-col p-5 shadow-lg overflow-y-auto navbar-scrollbar">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-center mb-10">Admin Panel</div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`flex items-center p-3 text-sm  ${
                      active === link.name ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    onClick={() => setActive(link.name)}
                  >
                    <Icon className="w-5 h-5 mr-3" colr /> {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="mt-10">
          <button
            className="flex items-center p-3 w-full bg-red-600 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger aria-label="Open menu" className="focus:outline-none">
            <RiMenu2Fill className="w-8 h-8 text-gray-800 hover:text-gray-600 transition-colors duration-200 cursor-pointer" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 bg-gray-900 text-white p-5 overflow-auto"
          >
            <SheetHeader>
              <SheetTitle className="text-white text-center">
                {" "}
                Admin Panel
              </SheetTitle>
              <SheetDescription className="text-white text-center">
                Navigation Menu
              </SheetDescription>
            </SheetHeader>
            <nav>
              <ul className="space-y-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`flex items-center p-3 text-sm rounded-md ${
                          active === link.name
                            ? "bg-gray-800 text-white"
                            : "hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          setActive(link.name);
                          setSheetOpen(false);
                        }}
                      >
                        <Icon className="w-5 h-5 mr-3" /> {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-10">
              <button
                className="flex items-center p-3 w-full bg-red-600 rounded-md cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" /> Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Sidebar;
