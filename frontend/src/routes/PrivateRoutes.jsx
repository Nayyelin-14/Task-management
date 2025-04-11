import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoutes = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoutes;
