import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: [], // always array
  reducers: {
    addConnection: (state, action) => {
      // Ensure state is always array
      return Array.isArray(action.payload) ? action.payload : [action.payload];
    },
    removeConnection: (state, action) => {
      return state.filter(conn => conn._id !== action.payload);
    }
  }
});

export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
