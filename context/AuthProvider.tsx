// After Login On page refresh initially localstorage is not Accessible to Store Due to SSR
// Hence While Using UseEffect fetching token and updating authentication
// Whole App Routing Can Be Managed From Here Based On Authentication

import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  googleloginAsync,
  isAuthenticate,
  loginAsync,
  logout,
} from "@/stores/slices/AuthSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface RouteConfig {
  path: string;
  type: string;
}

// Route Type
export const routeConfig: RouteConfig[] = [
  { path: "/login", type: "public" },
  { path: "/register", type: "public" },
  { path: "/chat", type: "private" },
  { path: "/logs", type: "private" },
  { path: "/chat/user", type: "private" },
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  // Redux Store States
  const selectAuthState = (state: any) => state.auth;
  const { user, isAuthenticated } = useSelector(selectAuthState);

  // Accessing Token and Update its Authentication and Manage App Routing
  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token && router.asPath !== "/register") {
    if (!token) {
      dispatch(isAuthenticate({ isAuthenticated: false }));
    } else {
      dispatch(isAuthenticate({ isAuthenticated: true }));
    }

    const currentPath = router.pathname;
    const route = routeConfig.find((route) => route.path === currentPath);

    if (route && route.type === "private" && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router.pathname]);

  interface LoginParams {
    email: string;
    password: string;
  }

  // Auth Context Login function
  const login = async ({ email, password }: LoginParams) => {
    try {
      // Dispatch login action
      const res = await dispatch(loginAsync({ email, password }));
      if (res?.payload) {
        toast.success(res?.payload?.message || "Logged in successfully");
        router.push("/chat");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Auth Context Google Login function
  const googleLogin = async (credentialResponse: any) => {
    try {
      // Dispatch Social login action
      const res = await dispatch(
        googleloginAsync({ token: credentialResponse.credential })
      );
      if (res?.payload) {
        toast.success(res?.payload?.message || "Logged in successfully");
        router.push("/chat");
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  // Auth Context Logout function
  const logoutUser = async () => {
    try {
      // Dispatch logout action
      await dispatch(logout());
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, googleLogin, user, login, logoutUser }}
    >
      <>
        <Toaster />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
