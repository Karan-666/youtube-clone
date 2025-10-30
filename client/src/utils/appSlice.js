// appSlice.js - Manages general application UI state (like sidebar visibility)

import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for this slice.
const appSlice = createSlice({
  // Name of the slice.
  name: "app",

  // Initial state object. Sidebar starts as visible (true).
  initialState: {
    isMenuOpen: true,
    // we need search state in redux as filter is in header but filtering logic is in body
    searchQuery: "",
    selectedCategory: "All",
  },

  // Reducer functions define how the state can be updated.
  reducers: {
    // Reducer to simply flip the state of the sidebar (true -> false, or false -> true).
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    // Reducer to explicitly close the menu (used when navigating to the Watch page).
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
    // Reducer to update the search query state.
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Reducer to update the selected category.
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

// Export the actions and the reducer (for the store).
export const { toggleMenu, closeMenu, setSearchQuery, setCategory } =
  appSlice.actions;
export default appSlice.reducer;
