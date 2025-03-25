// /src/context/ChatContext.js
import React, { createContext, useReducer } from "react";

const ChatContext = createContext();

const initialState = {
  sessions: [],
  activeSession: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "SET_ACTIVE_SESSION":
      return { ...state, activeSession: action.payload };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
