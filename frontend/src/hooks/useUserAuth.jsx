import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
  const { clearUser, user, loading } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }
    if (loading) return;

    if (!user) {
      clearUser(null);
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};

export default useUserAuth;
