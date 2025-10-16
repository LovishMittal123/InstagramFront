import { createSlice } from "@reduxjs/toolkit";

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState: [], // always array
  reducers: {
    setSuggestions: (state, action) => {
      return Array.isArray(action.payload) ? action.payload : [action.payload];
    },
    clearSuggestions: () => []
  }
});

export const { setSuggestions, clearSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;
