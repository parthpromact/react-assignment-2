import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface Log {
  time: string;
  method: string;
  path: string;
  status: string;
  durationMs: number;
  ip: string;
  username: string;
  userId: number;
}

// Available columns
const COLUMNS = [
  { id: "userId", label: "User ID" },
  { id: "username", label: "Username" },
  { id: "method", label: "Method" },
  { id: "status", label: "Status" },
  { id: "ip", label: "IP Address" },
  { id: "path", label: "Path" },
  { id: "time", label: "Time" },
];

const LogsPage = () => {
  const router = useRouter();

  // local states
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    COLUMNS.map((col) => col.id)
  );
  const [from, setFrom] = useState(new Date(Date.now() - 5 * 60 * 1000));
  const [to, setTo] = useState(new Date());
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Dropdown Ref for Columm Dropdown
  const dropdownRef = useRef<any>(null);

  // As Start Time and End Time changes API Call is made
  useEffect(() => {
    fetchLogs();
  }, [from, to]);

  // To Close the Column Dropdown on Click on Outside
  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // API Call for Fetch Logs
  const fetchLogs = async () => {
    setLoading(true);
    if (to.getTime() < from.getTime()) {
      toast.error("End time cannot be before start time");
      return;
    }
    try {
      const res: any = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/logs`,
        {
          params: {
            startTime: from.toISOString(),
            endTime: to.toISOString(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res?.status == 200) {
        toast.success(res?.data?.message || "Log fetched successfully");
        const logs = res.data.data.map((item: any) => ({
          time: item.timeofcall,
          method: item.method,
          path: item.route,
          status: item.status || "200",
          ip: item.ip,
          username: item.username,
          userId: item.userId,
        }));

        setAllLogs(logs);
      } else {
        toast.error(res?.data?.message || "Failed to fetch logs");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle column selection
  const toggleColumn = (columnId: any) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  // Toggle all columns
  const toggleAllColumns = () => {
    if (selectedColumns.length === COLUMNS.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(COLUMNS.map((col) => col.id));
    }
  };

  // Set predefined time ranges
  const setTimeRange = (minutes: any) => {
    const now = new Date();
    const start = new Date(now.getTime() - minutes * 60 * 1000);
    setFrom(start);
    setTo(now);
  };

  // Apply custom date range
  const applyCustomRange = () => {
    if (customFrom && customTo) {
      setFrom(new Date(customFrom));
      setTo(new Date(customTo));
    }
  };

  // const handleClick = () => {
  //   router.push("/chat")
  // }

  return (
    <div className="w-screen h-[91vh] bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB]">
      <div className="container mx-auto p-4">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-purple-950">
              User Logs
            </h1>
          </div>
          <div>
            {/* <button
              className="flex bg-gradient-to-br from-[#614385] to-[#516395] text-white p-3 font-semibold rounded-md hover:scale-105 cursor-pointer group"
              style={{ transition: "all 0.2s ease-in-out" }}
            >
              <button onClick={() => handleClick()}>Go to Chat</button>
              <div className="">
                <p className="h-4 w-4 ml-2 group-hover:translate-x-1 text-lg">
                  →
                </p>
              </div>
            </button> */}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setTimeRange(5)}
            className="bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold py-2 px-4 rounded cursor-pointer"
          >
            Last 5 mins
          </button>
          <button
            onClick={() => setTimeRange(10)}
            className="bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold py-2 px-4 rounded cursor-pointer"
          >
            Last 10 mins
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className="bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold py-2 px-4 rounded cursor-pointer"
          >
            Last 30 mins
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="datetime-local"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="border p-2 rounded focus:ring-blue-500 cursor-pointer"
              max={customTo}
            />
            <span>to</span>
            <input
              type="datetime-local"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="border p-2 rounded focus:ring-blue-500 cursor-pointer"
              min={customFrom}
              disabled={!customFrom}
            />
            <button
              onClick={applyCustomRange}
              className="bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold py-2 px-4 rounded cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>

        <div className="mb-4 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold py-2 px-4 rounded  flex items-center cursor-pointer"
          >
            Columns ({selectedColumns.length}/{COLUMNS.length})
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute mt-2 w-64 bg-white rounded shadow-lg z-10 p-2 border border-gray-200">
              <div className="p-2 border-b">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColumns.length === COLUMNS.length}
                    onChange={toggleAllColumns}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="font-semibold">All Columns</span>
                </label>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {COLUMNS.map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center space-x-2 cursor-pointer mt-2"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col.id)}
                      onChange={() => toggleColumn(col.id)}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tailwind Table */}
        <div className="overflow-x-auto shadow-md rounded-lg sticky top-[100px]">
          <div className="sticky top-0 bg-white z-10">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gradient-to-tl text-white from-[#614385] to-[#516395] text-xs uppercase sticky top-0 z-20">
                <tr>
                  {selectedColumns.includes("userId") && (
                    <th className="px-2 py-3">User ID</th>
                  )}
                  {selectedColumns.includes("username") && (
                    <th className="py-3 px-1">Username</th>
                  )}
                  {selectedColumns.includes("method") && (
                    <th className="px-5 py-3">Method</th>
                  )}
                  {selectedColumns.includes("status") && (
                    <th className="px-5 py-3">Status</th>
                  )}
                  {selectedColumns.includes("ip") && (
                    <th className=" py-5 px-3">IP</th>
                  )}
                  {selectedColumns.includes("path") && (
                    <th className="px-20 py-3">Path</th>
                  )}
                  {selectedColumns.includes("time") && (
                    <th className="pl-10 pr-20">Time</th>
                  )}
                </tr>
              </thead>
            </table>
          </div>

          <div className="max-h-[calc(91vh-300px)] overflow-y-auto">
            <table className="w-full text-sm text-left  text-gray-500">
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan={selectedColumns.length || 1}
                      className="p-3 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : allLogs.length > 0 ? (
                  allLogs.map((log: any, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 ">
                      {selectedColumns.includes("userId") && (
                        <td className="py-3 px-8">{log.userId}</td>
                      )}
                      {selectedColumns.includes("username") && (
                        <td className="py-3 px-5">{log.username}</td>
                      )}
                      {selectedColumns.includes("method") && (
                        <td className="py-3 px-6">{log.method}</td>
                      )}
                      {selectedColumns.includes("status") && (
                        <td className="py-3 px-8">{log.status}</td>
                      )}
                      {selectedColumns.includes("ip") && (
                        <td className="py-3 px-4">{log.ip}</td>
                      )}
                      {selectedColumns.includes("path") && (
                        <td className="p-3 px-8">
                          {log.path.length > 15
                            ? `${log.path.slice(0, 15)}...`
                            : log.path}
                        </td>
                      )}
                      {selectedColumns.includes("time") && (
                        <td className="py-3">
                          {new Date(log.time).toLocaleString()}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={selectedColumns.length || 1}
                      className="p-3 text-center"
                    >
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-tl text-white from-[#614385] to-[#516395] border-t">
            <p className="text-sm ">Total Logs: {allLogs?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
