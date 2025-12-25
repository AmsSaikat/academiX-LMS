import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import courseSlice from './courseSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    course:courseSlice
  },
});

export default store; 
