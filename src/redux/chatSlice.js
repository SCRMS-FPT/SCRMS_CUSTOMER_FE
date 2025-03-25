// /src/redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    sessions: [],
    activeSession: null,
  },
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
  },
});

export const { setSessions, setActiveSession } = chatSlice.actions;
export default chatSlice.reducer;
