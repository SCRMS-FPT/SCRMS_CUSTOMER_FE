// src/store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client, LoginUserRequest } from "../API/ClientApi";

// Async thunk dùng để gọi API login qua ApiClient
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const apiClient = new Client("https://localhost:7105");
      const loginRequest = new LoginUserRequest({
        email: credentials.email,
        password: credentials.password,
      });

      // Gọi API login và nhận dữ liệu JSON chứa token và thông tin user
      const data = await apiClient.login(loginRequest);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userProfile", JSON.stringify(data.user));

      return { token: data.token, userProfile: data.user };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

const initialState = {
  token: localStorage.getItem("token") || "",
  userProfile: localStorage.getItem("userProfile")
    ? JSON.parse(localStorage.getItem("userProfile"))
    : null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Nếu muốn có action logout
    logout(state) {
      state.token = "";
      state.userProfile = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.userProfile = action.payload.userProfile;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
