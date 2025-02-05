import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signup = createAsyncThunk("auth/signup", async (userData) => {
  const response = await axios.post("http://localhost:5000/signup", userData);
  return response.data;
});

export const login = createAsyncThunk("auth/login", async (userData) => {
  const response = await axios.post("http://localhost:5000/login", userData);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("name", response.data.name);
  return { token: response.data.token, name: response.data.name };
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  return {};
});

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    isAuthenticated: !!localStorage.getItem("token"), 
    token: localStorage.getItem("token") || "", 
    name: localStorage.getItem("name") || ""
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
      // .addCase(forgot.fulfilled, (state,action) => {
      //   state.status ="otp-sent",
      //   state.message = action.payload
      // })
      // .addCase(logout.fulfilled, (state) => {
      //   state.isAuthenticated = false;
      //   state.token = "";
      //   state.name = "";
      // })
     
  },
});

export default authSlice.reducer;