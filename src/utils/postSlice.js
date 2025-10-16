import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: [], // always array
  reducers: {
    addPosts: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [action.payload];
    },
    removePosts: (state, action) => state.filter(post => post._id !== action.payload)
  }
});

export const { addPosts, removePosts } = postSlice.actions;
export default postSlice.reducer;
