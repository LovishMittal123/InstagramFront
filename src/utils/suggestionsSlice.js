// src/utils/suggestionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState: [],
  reducers: {
    setSuggestions: (state, action) => {
      return action.payload; // replace old suggestions
    },
    clearSuggestions: () => {
      return [];
    },
  },
});

export const { setSuggestions, clearSuggestions } = suggestionSlice.actions;
export default suggestionSlice.reducer;
