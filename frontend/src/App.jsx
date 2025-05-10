import React, { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import PrivateRoutes from "./routes/PrivateRoutes";
import ManageTask from "./pages/Admin/ManageTask";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUser from "./pages/Admin/ManageUser";
import MyTasks from "./pages/User/MyTasks";
import UserDashboard from "./pages/User/UserDashboard";
import TaskDetails from "./pages/User/TaskDetails";
import SignUp from "./pages/Auth/SignUp";
import UserProvider, { UserContext } from "./context/userContext";
import ProtectedRoute from "./utils/protectedRoute";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute>
                  <SignUp />
                </ProtectedRoute>
              }
            />

            <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUser />} />
            </Route>

            <Route element={<PrivateRoutes allowedRoles={["member"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/user-detailtask/:taskId"
                element={<TaskDetails />}
              />
            </Route>
            <Route path="/" element={<Root />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;

const Root = () => {
  const { loading, user } = useContext(UserContext);
  if (loading) return <Outlet />; // Show nested routes while loading
  console.log(user);
  const hasToken = localStorage.getItem("token");
  if (!user && !hasToken) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
