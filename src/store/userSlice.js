import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client, LoginUserRequest } from "@/API/IdentityApi";

export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const apiClient = new Client("http://localhost:6001");
      const loginRequest = new LoginUserRequest({
        email: credentials.email,
        password: credentials.password,
      });

      const data = await apiClient.login(loginRequest);

      if (!data || !data.token || !data.user) {
        return rejectWithValue("Invalid login response");
      }

      // Lưu token và user vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userProfile", JSON.stringify(data.user));

      return { token: data.token, userProfile: data.user };
    } catch (error) {
      return rejectWithValue(error.status + ": " + error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (googleToken, { rejectWithValue }) => {
    try {
      const apiClient = new Client("http://localhost:6001");
      const data = await apiClient.loginWithGoogle(googleToken);

      if (!data || !data.token || !data.user) {
        return rejectWithValue("Invalid Google login response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userProfile", JSON.stringify(data.user));

      return { token: data.token, userProfile: data.user };
    } catch (error) {
      return rejectWithValue(error.status + ": " + error.message);
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
    logout(state) {
      state.token = "";
      state.userProfile = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login bằng email/password
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

      // ✅ Login bằng Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.userProfile = action.payload.userProfile;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
