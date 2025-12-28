import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",   
  initialState: [], 
  //HI
  reducers: {
    addPosts: (state, action) => {
      return action.payload;
    },
    removePosts: (state, action) => {
     return state.filter(post => post._id !== action.payload);
    }

  },
});

export const { addPosts ,removePosts} = postSlice.actions;
export default postSlice.reducer;
