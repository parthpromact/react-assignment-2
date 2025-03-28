import {
  createSlice,
  current,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
}

const initialState = {
  messages: [] as Message[],
  loading: false,
  totalPages: 0,
  currentPage: 1,
  searchMessages: [] as Message[],
  searchTotalPages : 0,
  searchCurrentPage : 1,
  searchLoading: false
};

// API Call for Fetch Messages and Update Redux Store
export const conversationMessages = createAsyncThunk(
  "conversation/fetchMessages",
  async (params: any) => {
    console.log("🚀 ~ params:", params)
    try {
      const token = localStorage.getItem("token");
      const id = typeof params.id === "string" ? parseInt(params.id) : params.id;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages?receiverId=${id}&page=${params.page}&&count=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        message: response?.data?.message,
        data: response?.data?.data,
      };
    } catch (error: any) {
      if (error?.response) {
        const message =
          error?.response?.data?.message || "Something went wrong";
        toast.error(message);
        return isRejectedWithValue(message);
      } else {
        return isRejectedWithValue("Something went wrong");
      }
    }
  }
);

// API Call for Search Messages and Update Redux Store
export const searchConversationMessages = createAsyncThunk(
  "conversation/searchMessages",
  async (params: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/conversation/search?receiverId=${params.id}&page=${params.page}&&count=99&message=${params.message}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return {
        message: response?.data?.message,
        data: response?.data?.data,
      };
    } catch (error: any) {
      if (error?.response) {
        const message =
          error?.response?.data?.message || "Something went wrong";
        toast.error(message);
        return isRejectedWithValue(message);
      } else {
        return isRejectedWithValue("Something went wrong");
      }
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(conversationMessages.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      conversationMessages.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.messages = action?.payload?.data?.messages;
        state.totalPages = action?.payload?.data?.totalPage;
        state.currentPage = action?.payload?.data?.currentPage;
        state.loading = false;
      }
    );
    builder.addCase(conversationMessages.rejected, (state, action) => {
      state.loading = false;
    });
  builder.addCase(searchConversationMessages.pending, (state, action) => {
    state.searchLoading = true;
  });
    builder.addCase(searchConversationMessages.fulfilled, (state, action: PayloadAction<any>) => {
      state.searchMessages = action?.payload?.data?.messages;
      state.searchTotalPages = action?.payload?.data?.totalPage;
      state.searchCurrentPage = action?.payload?.data?.currentPage;
      state.searchLoading = false;
    });
    builder.addCase(searchConversationMessages.rejected, (state, action) => {
      state.searchLoading = false;
    });
  },
});

export default messageSlice.reducer;
