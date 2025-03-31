import {
  createSlice,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface LoginParams {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

// Login API Call and Update Redux Store
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (params: LoginParams) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        params
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

// Register API Call Directly Used in Register Page
export const registerAsync = createAsyncThunk(
  "auth/register",
  async (params: RegisterParams) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        params
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

// Google Login API Call and Update Redux Store
export const googleloginAsync = createAsyncThunk(
  "auth/google-login",
  async (params: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/google-creds`,
        {...params, type: 'login'}
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

// Google Sign up API Call
export const googleSignUpAsync = createAsyncThunk(
  "auth/google-register",
  async (params: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/google-creds`,
        {...params, type: 'register'}
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
    isAuthenticate: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },

    googleLogin: (
      state,
      action: PayloadAction<{ user: User; tokens: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      loginAsync.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.user = action.payload?.data?.userData;
        state.isAuthenticated = true;
        state.loading = false;
        if (action?.payload?.data?.token) {
          localStorage.setItem("token", action?.payload?.data?.token);
          localStorage.setItem(
            "userId",
            action?.payload?.data?.userData?.userId
          );
        }
      }
    );
    builder.addCase(loginAsync.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(googleloginAsync.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      googleloginAsync.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.user = action.payload?.data?.userData;
        state.isAuthenticated = true;
        state.loading = false;
        if (action?.payload?.data?.tokens) {
          localStorage.setItem("token", action?.payload?.data?.tokens);
          localStorage.setItem(
            "userId",
            action?.payload?.data?.userData?.userId
          );
        }
      }
    );
    builder.addCase(googleloginAsync.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { login, logout, isAuthenticate, googleLogin } = authSlice.actions;

export default authSlice.reducer;
