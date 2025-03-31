import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";

// Login Validation Using Yup
const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const router = useRouter();
  // Accessing Auth Context Function
  const { login, googleLogin, isAuthenticated } = useAuth() as {
    login: ({ email, password }: { email: string; password: string }) => void;
    googleLogin: (credentialResponse: any) => Promise<void>;
    isAuthenticated: any;
  };

  // Local State
  const [showPassword, setShowPassword] = useState(false);

  // UseForm for Login
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  // Authenticated User Try to access Login Page so redirect to Logs Page
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated]);

  // On Submit Function for Login
  const onSubmit = async (data: { email: string; password: string }) => {
    login(data);
    reset();
  };

  // On Success Google Login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse);
    } catch (err: any) {
      console.log("Error", err);
    }
  };

  // On Failure Google Login
  const handleGoogleFailure = () => {
    console.log("Google login failed");
  };

  // For Custom Google Login
  // const initiateGoogleLogin = async () => {
  //   try {
  //     const response = await axios
  //       .get(`${process.env.NEXT_PUBLIC_API_URL}/google-auth-url`)
  //       .then((res) => {
  //         console.log("Response", res);
  //         window.location.href = res.data.data.authUrl;
  //       });
  //   } catch (error) {
  //     console.error("Failed to get Google Auth URL", error);
  //   }
  // };

  return (
    <div className="flex justify-center items-center w-screen mx-auto h-screen my-auto">
      <Toaster />
      <div className="w-[400px] h-[420px] rounded-xl shadow-lg shadow-blue-500/50  border-1 border-blue-500 bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB]">
        <div className="flex flex-col my-8">
          <div className="flex justify-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              id="Capa_1"
              width="30"
              height="30"
              fill="#000"
              version="1.1"
              viewBox="0 0 58 58"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#0683ea"
                  d="M39.767 25.913a1 1 0 0 1-.878-.519c-2.795-5.097-8.115-8.679-13.883-9.349a1 1 0 1 1 .23-1.986c6.401.743 12.304 4.718 15.406 10.373a1 1 0 0 1-.875 1.481"
                ></path>
                <path
                  fill="#37b7e1"
                  d="m0 58 4.042-12.125a23 23 0 0 1-3.231-11.78C.81 21.34 11.15 11 23.905 11S47 21.34 47 34.095 36.66 57.19 23.905 57.19c-3.881 0-7.535-.961-10.745-2.653z"
                ></path>
                <path
                  fill="#47363D"
                  d="M23.905 11C36.66 11 47 21.34 47 34.095c0 3.378-.731 6.583-2.034 9.475L58 47l-4.042-12.125a23 23 0 0 0 3.231-11.78C57.19 10.34 46.85 0 34.095 0c-9.426 0-17.528 5.65-21.118 13.746A23 23 0 0 1 23.905 11"
                ></path>
              </g>
            </svg>
            <h1 className="text-2xl font-bold text-blue-950 font-sans">
              {" "}
              Chat App
            </h1>
          </div>

          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-blue-600 font-mono">
              Login
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-col mt-5 w-full px-10">
                <label htmlFor="email" className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Email
                </label>
                <input
                  className=" rounded-2xl border-2 border-blue-500 p-2 h-8 bg-white text-sm"
                  type="text"
                  placeholder="Enter your email here..."
                  {...register("email")}
                />
                {errors && errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col mt-5 w-full px-10">
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Password
                </div>
                <div className="relative flex w-full bg-white h-8 px-2  border-2 border-blue-500 rounded-2xl">
                  <input
                    className=" bg-white outline-none w-full text-sm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password here..."
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors && errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center">
              <button className="rounded-xl shadow-lg px-16 py-2 mt-5 bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold ">
                LOGIN
              </button>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
              {/* Uncomment Below Button for Custom Google Login */}
              {/* <button
                onClick={() => initiateGoogleLogin()}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none w-full max-w-xs transition-colors duration-300"
              >
                <div className="bg-white h-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                  >
                    <path
                      fill="#FFC107"
                      d="M21.805 10.041H21V10H12v4h5.652c-0.825 2.329 -3.04 4 -5.652 4 -3.313 0 -6 -2.687 -6 -6s2.687 -6 6 -6c1.53 0 2.921 0.577 3.981 1.52l2.829 -2.829C17.023 3.026 14.634 2 12 2 6.478 2 2 6.478 2 12s4.478 10 10 10 10 -4.478 10 -10c0 -0.67 -0.069 -1.325 -0.195 -1.958"
                    />
                    <path
                      fill="#FF3D00"
                      d="m3.153 7.346 3.285 2.409C7.327 7.554 9.48 6 12 6c1.53 0 2.921 0.577 3.981 1.52l2.829 -2.829C17.023 3.026 14.634 2 12 2 8.159 2 4.828 4.168 3.153 7.346"
                    />
                    <path
                      fill="#4CAF50"
                      d="M12 22c2.583 0 4.93 -0.989 6.705 -2.596l-3.095 -2.619A5.95 5.95 0 0 1 12 18c-2.601 0 -4.809 -1.659 -5.641 -3.973l-3.261 2.513C4.753 19.778 8.114 22 12 22"
                    />
                    <path
                      fill="#1976D2"
                      d="M21.805 10.041H21V10H12v4h5.652a6.02 6.02 0 0 1 -2.043 2.785l0.002 -0.001 3.095 2.619C18.485 19.602 22 17 22 12c0 -0.67 -0.069 -1.325 -0.195 -1.958"
                    />
                  </svg>
                </div>
                <p className="ml-3"> Sign in with Google</p>
              </button> */}
            </div>

            <div className="flex flex-col justify-center items-center mt-2">
              <p className="">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-500">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
