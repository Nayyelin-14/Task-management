import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "react-toastify";
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      setUser(null);
      setLoading(false);

      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.GET_USER_PROFILE
        );
        console.log(response);
        setUser(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Only run on initial mount

  const updateUser = (UserData) => {
    setUser(UserData);
    localStorage.setItem("token", UserData.token);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
