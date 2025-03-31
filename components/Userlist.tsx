import { userList } from "@/stores/slices/UserSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAuth } from "@/context/AuthProvider";

interface User {
  id: number;
  name: string;
  email: string;
}
const Userlist = ({
  users,
  selectedUser,
}: {
  users: User;
  selectedUser?: number | null;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  // local State
  const [toastDisplayed, setToastDisplayed] = useState(false);

  // logout function used from AuthContext
  const { logoutUser } = useAuth() as any;

  // Capilize First Letter of User
  const capLetter = (str: String) => {
    return str.charAt(0).toUpperCase();
  };

  // Handle Routing to User Conversation
  const handleClick = (id: number) => {
    router.push({
      pathname: `/chat/user/[id]`,
      query: { id: String(id) },
    });
  };

  // User List API Call
  const fetchUsers = async () => {
    try {
      const response = await dispatch(userList());
      if (response?.payload && !toastDisplayed) {
        toast.success(
          response?.payload?.data?.message || "Fetched Users Suceesfully",
          { id: "userlist" }
        );
        setToastDisplayed(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Fetch User List on Mount If No User Selected or User List is Empty
  useEffect(() => {
    if (
      !selectedUser ||
      (users && Array.isArray(users) && users.length === 0)
    ) {
      fetchUsers();
    }
  }, []);

  return (
    <div className="flex flex-col w-1/3 border-r-2 border-blue-500 h-[91vh] overflow-y-auto">
      <div className="flex flex-col">
        <div className="flex gap-3 p-3 text-center justify-between border-b-4 border-blue-500">
          <div>
            <p className="text-xl font-semibold text-purple-950">Users List</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gradient-to-tr to-[#614385] from-[#516395] text-white p-2 rounded-md hover:scale-105 font-semibold cursor-pointer">
              <Link href="/logs">My Logs</Link>
            </button>
          </div>
        </div>
        <div>
          {users &&
            Array.isArray(users) &&
            users.length > 0 &&
            users.map((user: User) => (
              <div
                key={user.id}
                className={`gap-3 p-3 rounded-md cursor-pointer ${
                  selectedUser === user.id
                    ? "bg-gradient-to-tr to-[#614385] from-[#516395] text-white"
                    : ""
                }`}
                onClick={() => handleClick(user.id)}
              >
                <div className="flex pl-5">
                  <div className="w-1/6">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        selectedUser === user.id
                          ? "bg-white"
                          : "bg-gradient-to-tr to-[#614385] from-[#516395] text-white"
                      }`}
                      style={{ textAlign: "center", paddingTop: "0.5rem" }}
                    >
                      <p
                        className={`  ${
                          selectedUser === user.id
                            ? "text-purple-900 font-extrabold"
                            : "text-white font-bold"
                        }`}
                      >
                        {capLetter(user.name)}
                      </p>
                    </div>
                  </div>
                  <div className="w-5/6">
                    <p className="font-bold">
                      {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                    </p>
                    <p
                      className={
                        selectedUser === user.id
                          ? "text-white"
                          : "text-gray-400"
                      }
                      style={{ fontSize: "0.875rem" }}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="relative flex mt-4 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Userlist;
