import React, { useEffect, useState } from "react";
import {
  Home,
  Settings,
  Users,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "@/features/userSlice";
import { getCategories } from "@/features/categorySlics";
import { getTags } from "@/features/tagSlice";
import { FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Users", path: "/users", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Products", path: "/products/1", icon: Package },
    { name: "Orders", path: "/order/1", icon: ShoppingBag },
    { name: "Abandoned Cart", path: "/abandoned-cart/1", icon: Package },
    { name: "Categories", path: "/category", icon: Package },
    { name: "Tags", path: "/tag", icon: Package },
    { name: "Traffic", path: "/traffic", icon: FaUsers },
    { name: "Collabos", path: "/collabos", icon: Users },
  ];

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
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-5 shadow-lg">
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
                  className={`flex items-center p-3 rounded-md ${
                    active === link.name ? "bg-gray-800" : "hover:bg-gray-800"
                  }`}
                  onClick={() => setActive(link.name)}
                >
                  <Icon className="w-5 h-5 mr-3" /> {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="mt-auto">
        <button
          className="flex items-center p-3 w-full hover:bg-red-600 rounded-md cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
