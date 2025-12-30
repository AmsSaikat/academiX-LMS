import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import courseSlice from './courseSlice';
import lectureSlice from './lectureSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    course:courseSlice,
    lecture:lectureSlice
  },
});

export default store; 
