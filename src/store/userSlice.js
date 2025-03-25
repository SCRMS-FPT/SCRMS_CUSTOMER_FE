import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client, LoginUserRequest } from "../API/IdentityApi";

// Async thunk dùng để gọi API login qua ApiClient
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const apiClient = new Client();
      const loginRequest = new LoginUserRequest({
        email: credentials.email,
        password: credentials.password,
      });

      const data = await apiClient.login(loginRequest);
      console.log("Login Response:", data); // ✅ Debug Log

      // Ensure data is valid before accessing properties
      if (!data || !data.token || !data.user) {
        return rejectWithValue("Invalid login response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userProfile", JSON.stringify(data.user));

      return { token: data.token, userProfile: data.user };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Add new thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (updatedProfile, { rejectWithValue }) => {
    try {
      // No API call needed, just return the updated profile
      return { userProfile: updatedProfile };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
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
    // Add new reducer for direct profile updates
    updateProfile(state, action) {
      state.userProfile = action.payload;
      localStorage.setItem("userProfile", JSON.stringify(action.payload));
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
      })
      // Add cases for updating user profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload.userProfile;
      });
  },
});

export const { logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
