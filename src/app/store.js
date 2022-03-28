import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/userSlice";
import configReducer from "../features/config/configSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    config: configReducer,
  },
});
