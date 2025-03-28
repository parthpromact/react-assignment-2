import {
  conversationMessages,
  searchConversationMessages,
} from "@/stores/slices/MessageSlice";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import { io } from "socket.io-client";
import { setTimeout } from "timers";
import SearchMessages from "./SearchMessages";
const socket = io("http://localhost:5000");

const Chatbody = ({
  isSelectedUser,
  selectedUserId,
}: {
  isSelectedUser: boolean;
  selectedUserId?: number;
}) => {
  const dispatch = useDispatch<any>();

  // Redux Store States
  const messages = useSelector((state: any) => state.messages.messages);
  const totalPages = useSelector((state: any) => state.messages.totalPages);
  const currentPage = useSelector((state: any) => state.messages.currentPage);
  const selectedUser = useSelector((state: any) => state.users.userSelected);
  const user = useSelector((state: any) => state.auth.user);

  // Modal and Other States
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState<any>(false);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [messageId, setMessageId] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMain, setIsMain] = useState(true);
  const [isEditDialog, setIsEditDialog] = useState<any>(false);
  const [toastDisplayed, setToastDisplayed] = useState(false);

  // Chat Container Ref Which Used for Scroll Whole Chat Body
  const chatContainerRef = useRef<any>(null); // ChatRef

  // Prvious Message Ref used to add new message to Display Message(disMsg) array
  const prevMsgRef = useRef<any[]>([]); // MessageRef

  // User Id Ref Used to track selected UserId gets Changed or Not
  const prevUserIdRef = useRef<any>(undefined); // ref for USer

  // Height Ref for On Scroll To Top of Chat Body
  const prevHeight = useRef<number>(0);

  const UserId = localStorage.getItem("userId");

  // Delay function
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Scroll to bottom when messages change like send Message or edit message
  useEffect(() => {
    if (chatContainerRef.current && !isLoading && currentPage === 1) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, currentPage]);

  // Set Value of Previous Message Ref as Messages or Selected User Get Changed
  useEffect(() => {
    if (selectedUserId !== prevUserIdRef.current) {
      prevMsgRef.current = messages || [];
      prevUserIdRef.current = selectedUserId;
    } else if (currentPage > 1) {
      const existId = new Set(prevMsgRef.current.map((i) => i.id));
      const newMessage = (messages || []).filter(
        (v: any) => !existId.has(v.id)
      );
      prevMsgRef.current = [...prevMsgRef.current, ...newMessage];
    } else {
      prevMsgRef.current = messages || [];
    }
  }, [messages, selectedUserId, currentPage]);

  // Socket Events and Listeners
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("add-user", (data: any) => {
      console.log("online-users", data);
    });

    socket.on("receive-msg", (data: any) => {
      console.log("receive-msg", data);
      if (UserId == data.receiverId) {
        dispatch(
          conversationMessages({ id: parseInt(data.senderId), page: 1 })
        );
      }
    });
  }, [dispatch, prevMsgRef, selectedUserId]);

  // Add User to Socket
  useEffect(() => {
    socket.emit("add-user", user ? user?.userId : UserId);
  }, [user]);

  // Disconnect Socket as component unmount
  useEffect(() => {
    return () => {
      if (socket.connected) {
        socket.emit("disconnection");
      }
    };
  }, []);

  // Fetch Conversation as Selected User Get Changed
  useEffect(() => {
    if (selectedUserId) {
      setToastDisplayed(false);
      setMessage("");
      setIsEdit(false);
      // fetchConversation(1);
    }
  }, [selectedUserId]);

  // Trigger API call when toastDisplayed becomes false
  useEffect(() => {
    if (!toastDisplayed && isSelectedUser) {
      fetchConversation(1);
    }
  }, [toastDisplayed]);

  // Handle loading older messages when scrolling to top
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop } = chatContainerRef.current;
        if (scrollTop < 50 && currentPage < totalPages && !isLoading) {
          prevHeight.current = chatContainerRef.current.scrollHeight;
          fetchConversation(currentPage + 1);
        }
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentPage, totalPages, isLoading]);

  // Maintain scroll position after loading more messages
  useEffect(() => {
    if (
      chatContainerRef.current &&
      isLoading === false &&
      prevHeight.current > 0
    ) {
      const newHeight = chatContainerRef.current.scrollHeight;
      const heightDifference = newHeight - prevHeight.current;
      chatContainerRef.current.scrollTop =
        heightDifference > 0 ? heightDifference : 0;
      prevHeight.current = 0;
    }
  }, [isLoading]);

  // Fetch Conversation API Call
  const fetchConversation = async (page: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await dispatch(
        conversationMessages({ id: selectedUserId, page })
      );
      if (response?.payload) {
        if (!toastDisplayed && isMain) {
          toast.success(
            response?.payload?.message || "Fetched messages successfully",
            { id: "messages" }
          );
          setToastDisplayed(true);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Date Formatter
  const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString().slice(10, 26);
  };

  // API Call for Send Message and Edit Message
  const messageSent = async () => {
    const token = localStorage.getItem("token");
    if (message.trim() !== "") {
      if (isEdit) {
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`,
            { content: message },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.status == 200) {
            toast.success(
              response?.data?.message || "Message edited successfully"
            );
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
        } finally {
          setIsEdit(false);
          setMessage("");
          setIsMain(false);
          setMessageId(0);
          delay(1000).then(() => fetchConversation(1));
        }
      } else {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/messages`,
            { content: message, receiverId: parseInt(selectedUser) },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status == 200) {
            toast.success(
              response?.data?.message || "Message sent successfully"
            );

            socket.emit("send-msg", {
              senderId: user ? user?.userId : UserId,
              receiverId: selectedUserId,
              content: message,
            });
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
        } finally {
          setMessage("");
          setIsMain(false);
          delay(500).then(() => fetchConversation(1));
        }
      }
    }
  };

  // Handle Edit Message Modal
  const handleEditMessage = async (message: any) => {
    setMessage(message.content);
    setIsEdit(true);
    setMessageId(message.id);
    setIsModalOpen((prev: any) => ({
      ...prev,
      [message.id]: !prev[message.id],
    }));
  };

  // Handle Delete Message Modal
  const handleDeleteMessage = async (message: any) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${message.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status == 200) {
        toast.success(
          response?.data?.message || "Message deleted successfully"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsMain(false);
      delay(1000).then(() => fetchConversation(1));
    }
  };

  // Trigger Search API on Change of Search Input
  const searchMessages = async (search: string) => {
    if (search.trim() !== "") {
      setIsSearch(true);
      setTimeout(
        () =>
          dispatch(
            searchConversationMessages({
              id: selectedUserId,
              page: 1,
              message: search,
            })
          ),
        500
      );
    } else {
      setIsSearch(false);
    }
  };

  // Handle Search Close
  const handleSearchClose = () => {
    setIsSearch(false);
    setSearch("");
  };

  // Display Message based on previous message ref
  const disMsg = prevMsgRef.current;

  return (
    <div className="bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB] h-screen w-2/3 overflow-y-hidden flex flex-col">
      {isSelectedUser ? (
        <>
          <div className="flex items-center justify-between p-1">
            <input
              type="text"
              value={search}
              className="w-full rounded-l-lg p-2 cursor-pointer border-2 bg-white outline-none outline-white border-none focus:border-none"
              placeholder="Search a message..."
              onChange={(e) => {
                setSearch(e.target.value);
                searchMessages(e.target.value);
              }}
            />
            <div
              className="shadow-lg p-2 bg-white font-mono  font-semibold rounded-r-lg"
              // onClick={}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="24px"
                height="24px"
              >
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
              </svg>
            </div>
          </div>
          <div
            ref={chatContainerRef}
            id="chatContainer"
            className="flex flex-col items-end space-y-4 overflow-y-auto flex-grow p-4"
          >
            {isLoading && currentPage > 1 && (
              <div className="w-full text-center py-2 text-gray-600">
                Loading older messages...
              </div>
            )}
            {disMsg && disMsg?.length > 0 ? (
              [...disMsg].reverse().map((message: any, index: number) => (
                <div
                  key={message.id || index}
                  className="flex flex-col w-full px-4 items-end"
                >
                  {message.senderId !== parseInt(selectedUser) ? (
                    <div className="ml-auto">
                      <div className="bg-blue-500 text-white p-2 rounded-md shadow flex gap-2 items-center justify-center text-center">
                        <p className="text-base">{message.content}</p>
                        <div className="relative text-xs">
                          <button
                            onClick={() =>
                              setIsModalOpen((prev: any) => ({
                                ...prev,
                                [message.id]: !prev[message.id],
                              }))
                            }
                          >
                            <FaEllipsisV className=" hover:scale-110 cursor-pointer " />
                          </button>
                          {isModalOpen[message.id] && (
                            <div className="absolute right-0 mt-2 w-36 bg-blue-950 hover:bg-gray-800rounded-md shadow-lg z-100">
                              <ul className="py-1">
                                <li
                                  className="px-4 py-1 cursor-pointer text-md"
                                  onClick={() => {
                                    setIsEditDialog(true);
                                    handleEditMessage(message);
                                  }}
                                >
                                  Edit
                                </li>
                                <li
                                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                                  onClick={() => {
                                    setIsModalOpenConfirm({
                                      ...isModalOpenConfirm,
                                      [message.id]: true,
                                    });
                                  }}
                                >
                                  Delete
                                </li>
                                {isModalOpenConfirm[message.id] && (
                                  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs z-100">
                                    <div className="bg-blue-950 w-80 rounded-md shadow-lg p-4">
                                      <div className="flex flex-col items-center py-2">
                                        <p className="text-sm text-center">
                                          Are you sure you want to delete this
                                          message?
                                        </p>
                                        <div className="flex gap-2 mt-4">
                                          <button
                                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
                                            onClick={() => {
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              });
                                              setIsModalOpen((prev: any) => ({
                                                ...prev,
                                                [message.id]: !prev[message.id],
                                              }));
                                            }}
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                            onClick={() => {
                                              handleDeleteMessage(message);
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              });
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              });
                                              setIsModalOpen((prev: any) => ({
                                                ...prev,
                                                [message.id]: !prev[message.id],
                                              }));
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs mt-1 text-right text-gray-600">
                        {dateFormatter(message.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="mr-auto">
                      <div className="bg-white p-2 rounded-md shadow">
                        <p className="text-xs text-blue-600 font-semibold">
                          {message.sender?.name}
                        </p>
                        <p className="text-base">{message.content}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        {dateFormatter(message.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center text-center h-full font-semibold font-mono text-xl mx-auto">
                No messages to display.
              </div>
            )}
          </div>
          <div className="flex px-2 gap-2">
            {isEditDialog && (
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs z-100">
                <div className="bg-blue-950 w-80 rounded-md shadow-lg p-4">
                  <div className="flex flex-col items-center py-2">
                    <p className="text-sm text-center text-white">
                      Are you sure you want to edit this Message?
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer text-xs"
                        onClick={() => {
                          setIsEditDialog(false);
                          setIsEdit(false);
                          setMessage("");
                        }}
                      >
                        Decline
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer text-xs"
                        onClick={() => {
                          setIsEditDialog(false);
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <input
              type="text"
              value={message}
              className="w-full p-2 rounded-md border-2 bg-white border-purple-900 outline-1 outline-purple-900"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="rounded-xl shadow-lg px-10 py-2 bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold cursor-pointer"
              onClick={messageSent}
            >
              {isEdit ? "Edit" : "Send"}
            </button>
          </div>
          {isSearch && (
            <SearchMessages
              message={message}
              handleSearch={handleSearchClose}
              selectedUser={selectedUser}
            />
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-full font-semibold font-mono text-xl">
          To start a conversation, select a user from the left.
        </div>
      )}
    </div>
  );
};

export default Chatbody;
