import { setUser } from "@/stores/slices/UserSlice";
import dynamic from "next/dynamic";
const Userlist = dynamic(() => import("@/components/Userlist"), { ssr: false });
const Chatbody = dynamic(() => import("@/components/Chatbody"), { ssr: false });
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ChatConversation = () => {
  const dispatch = useDispatch<any>();
  const params = useParams();
  // Redux Store States
  const users = useSelector((state: any) => state.users.users);

  // local State
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Memoize the user Id on Page Change Which will help in message flickering and avoiding re-renders
  const id = useMemo(() => {
    const paramId = params?.id ? Number(params?.id) : null;
    if (paramId !== null && paramId != 0) {
      localStorage.setItem("selectedUserId", paramId.toString());
      return paramId;
    }
    const storedId = localStorage.getItem("selectedUserId");
    return storedId ? Number(storedId) : null;
  }, [params]);

  // Set User Id Based on Selected User
  useEffect(() => {
    if (id !== null) {
      // Dispatch Selected User Id
      dispatch(setUser(id));
      setSelectedId(id);
    }
  }, [id, dispatch]);

  return (
    <div className="flex">
      <Toaster />
      <>
        <Userlist users={users} selectedUser={params &&params?.id !== "0" || undefined || null ? Number(params.id) : selectedId} />
        <Chatbody isSelectedUser={true} selectedUserId={params && params?.id !== "0"  || undefined || null ? Number(params.id) : selectedId} />
      </>
    </div>
  );
};

export default ChatConversation;
