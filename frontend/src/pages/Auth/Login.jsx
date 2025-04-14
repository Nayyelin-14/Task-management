import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import FormInputs from "../../components/Inputs/FormInputs";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const user_roles = ["member", "admin"];
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Enter a valid email");
      toast.error(error);

      return;
    }
    if (!password) {
      setError("Password is required");
      toast.error(error);
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
      if (role.includes(user_roles)) {
        toast.success("LogIn successful");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        console.log(err);

        setError("Something went wrong");
      }
      toast.error(error);
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <FormInputs
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johnDoe@gmail.com"
            type="text"
            label="Email Address"
          />
          <FormInputs
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 Characters"
            type="password"
            label="Password"
          />
          {error && <p className="text-red-500 text-md pb-2.5">{error}</p>}

          <button className="btn-primary" type="submit">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-slate-600 underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
