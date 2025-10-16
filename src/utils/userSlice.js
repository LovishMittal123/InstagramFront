import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null, // null initially
  reducers: {
    addUser: (state, action) => action.payload || null,
    removeUser: () => null
  }
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
