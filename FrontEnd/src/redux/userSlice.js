import { createSlice } from "@reduxjs/toolkit";

const initialState = { userData: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserdata: (state, action) => {
      state.userData = action.payload;
    },
    clearUserdata: (state) => {    // added for logout/reset
      state.userData = null;
    },
  },
});

export const { setUserdata, clearUserdata } = userSlice.actions;
export default userSlice.reducer;
