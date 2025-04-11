import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timeout); // clean up if component unmounts
  }, [user, token]);

  if (loading) {
    return (
      <div className="text-3xl flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (user?.role === "admin") {
    return (
      <Navigate to="/admin/dashboard" replace state={{ from: location }} />
    );
  }

  if (user?.role === "user") {
    return <Navigate to="/user/dashboard" replace state={{ from: location }} />;
  }

  return children; // show login or whatever is wrapped inside <ProtectedRoute>
};

export default ProtectedRoute;
