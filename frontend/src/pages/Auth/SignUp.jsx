import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfileSelector from "../../components/Inputs/ProfileSelector";
import { Link, useNavigate } from "react-router-dom";
import FormInputs from "../../components/Inputs/FormInputs";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";

const SignUp = () => {
  const [profile, setProfile] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admininviteToken, setAdmininviteToken] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    //for image
    let profileImageUrl = "";

    if (!fullname) {
      setError("Fullname is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    // if (!admininviteToken) {
    //   setError("Token is required");
    //   return;
    // }
    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    try {
      //for image
      if (profile) {
        const imgUploadRes = await uploadImage(profile);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      //
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        admininviteToken,
        profileImageUrl,
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
      toast.success("LogIn successful");
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
      <div className="flex justify-center  lg:w-[100%] h-auto md:h-full mt-10 md:mt-0  flex-col">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us by entering your details below
        </p>
        <form onSubmit={handleSignup}>
          {" "}
          <ProfileSelector image={profile} setImage={setProfile} />
          <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
            <FormInputs
              type="text"
              value={fullname}
              placeholder="John"
              label="full Name"
              onChange={(e) => setFullname(e.target.value)}
            />
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

            <FormInputs
              value={admininviteToken}
              onChange={(e) => setAdmininviteToken(e.target.value)}
              placeholder="6 Digit Code"
              type="text"
              label="Admin invite token"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button className="btn-primary" type="submit">
            Sign Up
          </button>
          <p className="text-[13px] text-slate-800 mb-3">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-medium text-slate-600 underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
