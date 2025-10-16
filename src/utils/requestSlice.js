import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: [], // always array
  reducers: {
    addRequest: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [action.payload];
    },
    removeRequests: (state, action) => state.filter(req => req._id !== action.payload)
  }
});

export const { addRequest, removeRequests } = requestSlice.actions;
export default requestSlice.reducer;
