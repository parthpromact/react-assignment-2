import React, { use, useEffect } from "react";
import dynamic from "next/dynamic";
const Userlist = dynamic(() => import("@/components/Userlist"), { ssr: false });
const Chatbody = dynamic(() => import("@/components/Chatbody"), { ssr: false });
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

const Chat = () => {
  const dispatch = useDispatch<any>();

  // Fetch Users fromStore
  const users = useSelector((state: any) => state.users.users);

  return (
    <div className="flex">
      <Toaster />
      <Userlist users={users} />
      <Chatbody isSelectedUser={false} />
    </div>
  );
};

export default Chat;
