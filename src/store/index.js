import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import reviewReducer from "./reviewSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewReducer,
    notifications: notificationReducer,
  },
});

export default store;
