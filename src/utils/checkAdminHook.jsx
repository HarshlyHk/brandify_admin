import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { checkAuth } from "../features/userSlice";

const useAuthHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("drip_access_token");

    if (token) {
      dispatch(checkAuth())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("drip_access_token");
          navigate("/login");
        });
    }else{
      navigate("/login");
    }
  }, [dispatch, navigate]);
};

export default useAuthHook;