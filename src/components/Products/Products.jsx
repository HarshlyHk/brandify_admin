import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
const Products = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <Link to="/products/add" className="">
        Add Product
      </Link>
    </div>
  );
};

export default Products;
