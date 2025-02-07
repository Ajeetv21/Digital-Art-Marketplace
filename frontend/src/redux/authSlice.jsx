import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Signup
export const signup = createAsyncThunk("auth/signup", async (userData) => {
  const response = await axios.post("http://localhost:5000/signup", userData);
  return response.data;
});

// Login
export const login = createAsyncThunk("auth/login", async (userData) => {
  const response = await axios.post("http://localhost:5000/login", userData);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("name", response.data.name);
  return { token: response.data.token, name: response.data.name };
});

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  return {};
});

// Forgot Password (Send OTP)
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue("User not found");
    }
  }
);

// Reset Password (Verify OTP & Set New Password)
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/reset-password", formData);
      return response.data.message;
    } catch (error) {
      return rejectWithValue("Invalid OTP or expired OTP");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    isAuthenticated: !!localStorage.getItem("token"), 
    token: localStorage.getItem("token") || "", 
    name: localStorage.getItem("name") || "",
    forgotPasswordMessage: "",
    resetPasswordMessage: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.name = action.payload.name;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = "";
        state.name = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordMessage = action.payload;
      });
  },
});

export default authSlice.reducer;
