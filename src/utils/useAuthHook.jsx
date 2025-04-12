import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { checkAuth } from "../features/userSlice";

const useAuthHook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem("drip_access_token");

    if(user){
      return;
    }

    if (token) {
      dispatch(checkAuth())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("drip_access_token");
          navigate("/login");
        });
    }
  }, []);
};

export default useAuthHook;