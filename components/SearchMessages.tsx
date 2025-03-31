import React from "react";
import { useSelector } from "react-redux";

const SearchMessages = ({ handleSearch, selectedUser }: any) => {
  // Redux Store States
  const messages = useSelector((state: any) => state.messages.searchMessages);

  // Date Formatter
  const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString().slice(10, 26);
  };
  return (
    <div className="fixed top-16 left-0 z-10 w-1/3 bg-gray-200 p-4 pb-16 h-[91vh]">
      <div className="flex justify-between">
        <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-tr from-[#614385] to-[#516395]">
          <p>Search Messages</p>
        </div>
        <div className="flex justify-center cursor-pointer hover:scale-105 hover:bg-red-900 items-center border-1 border-white rounded-md w-8 h-8">
          <button
            className="text-3xl hover:text-white text-transparent bg-clip-text bg-gradient-to-tr from-[#614385] to-[#516395]"
            onClick={() => {
              handleSearch();
            }}
          >
            &times;
          </button>
        </div>
      </div>
      <div className="my-4 bg-gradient-to-tr from-[#614385] to-[#516395] h-full overflow-y-auto rounded-xl">
        {messages && messages?.length > 0 ? (
          [...messages].reverse().map((message: any, index: number) => (
            <div
              key={message.id || index}
              className="flex flex-col w-full p-4 items-end "
            >
              {message.senderId !== parseInt(selectedUser) ? (
                <div className="ml-auto">
                  <div className="bg-lime-500 text-white p-2 rounded-md shadow flex gap-2 items-center justify-center text-center">
                    <p className="text-base">{message.content}</p>
                    <div className="relative text-xs"></div>
                  </div>
                  <p className="text-xs mt-1 text-right text-white">
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
                  <p className="mt-1 text-xs text-white">
                    {dateFormatter(message.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-center h-full font-semibold font-mono text-md mx-auto">
            No messages match your search
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMessages;
