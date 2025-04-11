import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(user);
  useEffect(() => {
    console.log("hi");
    if (user) return; // If user already exists, skip fetching

    const accessToken = localStorage.getItem("token");

    if (accessToken === null) {
      setLoading(false);
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.GET_USER_PROFILE
        );

        setUser(response.data);
      } catch (error) {
        console.log("User is not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = (UserData) => {
    setUser(UserData);
    console.log("user updated");
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
