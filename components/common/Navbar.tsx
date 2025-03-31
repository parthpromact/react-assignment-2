import { logout } from "@/stores/slices/AuthSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux Stor State
  const user = useSelector((state: any) => state.auth.user);

  // Local States
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("User from Redux state:", user);
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div>
      <nav className="bg-gradient-to-r to-[#614385] from-[#516395] text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
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
            <h1 className="text-2xl font-bold text-white font-sans">
              {" "}
              Chat App
            </h1>
          </div>
          <div className="flex gap-5">
            <button className="cursor-pointer hover:scale-105 relative group" onClick={() => router.push("/logs")}>
              My Logs
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-800 group-hover:w-full group-hover:left-0 "></div>
            </button>

            <button className="cursor-pointer hover:scale-105 relative group"  onClick={() => router.push("/chat")}>
              Chat
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-800 group-hover:w-full group-hover:left-0 "></div>
            </button>
          </div>
          <div className="relative">
            <button
              className="text-white focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="font-semibold">{user?.name}</span>
              <svg
                className="w-5 h-5 ml-2 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg">
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold">User Details</p>
                  <p className="text-xs">{user?.email}</p>
                </div>
                <div
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200 hover:rounded-md"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
