// Manages the global state for user authentication status.

import { createSlice } from "@reduxjs/toolkit";

// Initial state checks if a token exists in localStorage from a previous session.
function getInitialState() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  return {
    isLoggedIn: !!token, // Convert the presence of a token to a boolean (true if token exists).
    username: username || null, // Store the username for display.
    token: token || null,
    userId: userId || null,
  };
}

const userSlice = createSlice({
  // name of slice
  name: "user",
  // initial state
  initialState: getInitialState(),
  // reducer functions to handle state changes
  reducers: {
    loginUser: (state, action) => {
      // The payload should contain { accessToken, username }.
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.token = action.payload.accessToken;
      // The actual token saving to localStorage is done in AuthModal,
      // but we update Redux here for immediate component re-render.
      state.userId = action.payload.userId;
    },
    // Reducer to handle user logout.
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.username = null;
      state.token = null;
      state.userId = null;
      // Clear the token and username from browser storage.
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
    },
  },
});

// Export the actions and the reducer (for the store).
export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
