import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import reviewReducer from "./reviewSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewReducer,
  },
});

export default store;
