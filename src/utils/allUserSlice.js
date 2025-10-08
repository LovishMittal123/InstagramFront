import { createSlice } from "@reduxjs/toolkit";

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: [],  // array of all users
  reducers: {
    setAllUsers: (state, action) => action.payload, // payload = array of users
    clearAllUsers: () => []
  }
});

export const { setAllUsers, clearAllUsers } = allUsersSlice.actions;
export default allUsersSlice.reducer;
