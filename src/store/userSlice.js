import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async login function to handle API request
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        // Save the token and userName to localStorage
        localStorage.setItem("token", data.result.token);
        localStorage.setItem("userName", data.result.user.name);
        return {
          token: data.result.token,
          userName: data.result.user.name,
        };
      } else {
        return rejectWithValue(data.message || "Login failed");
      }
    } catch (error) {
      console.log("Error:", error);
      return rejectWithValue("Login failed");
    }
  }
);

const initialState = {
  token: localStorage.getItem("token") || "",
  userName: localStorage.getItem("userName") || "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.userName = action.payload.userName;
    });
  },
});

export default userSlice.reducer;
