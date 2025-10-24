// Import icons for the hamburger menu and the YouTube logo.
import { HiMenu } from "react-icons/hi";
import { FaYoutube, FaSearch, FaUserCircle } from "react-icons/fa"; // FaUserCircle for the button icon
import { IoMdNotificationsOutline } from "react-icons/io";
import { GoUpload } from "react-icons/go"; // Icon for uploading a video (placeholder)
import { Link } from "react-router-dom"; // We'll need Link for the Sign-in button
import React, { useState } from "react"; // Import useState for modal visibility
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice.js";
import { logoutUser } from "../utils/userSlice.js";
  import { setSearchQuery } from "../utils/appSlice.js";

function Header() {
  // Local state to control whether the Sign-in Modal is visible (false = hidden initially).
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Hook to allow sending actions to the Redux store (used for sidebar toggle).
  const dispatch = useDispatch();

  // Subscribe to the user slice state.
  const { isLoggedIn, username } = useSelector((store) => store.user);
 // Subscribe to retrieve the search query
  const searchQuery = useSelector(store => store.app.searchQuery);


  //Function to handle the sidebar toggle click.
  function handleMenuToggle() {
    dispatch(toggleMenu());
  }

  //Function to handle the Sign-in button click.
  function handleSignInClick() {
    setShowAuthModal(true);
  }

  // Logout handler (for later use).
  function handleLogout(){
    // Dispatches the logout action, which clears Redux state and localStorage.
    dispatch(logoutUser());
  };

  function handleSearchInput(e){
    // The Redux State is Always One Step Behind
    // if we type YT, Redux state still holds the old value: 'Y'.
    // that's why we need e.target.value to set current value and make it a controlled input
    dispatch(setSearchQuery(e.target.value));
  }

  return (
    // The main header container, fixed height, white background, flex layout for organization.
    // justify-between pushes the items to the edges.
    <div className="flex justify-between h-14 bg-white p-3 shadow-md fixed w-full z-10 top-0">
      {/*Left Section: Menu Icon and Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu Icon (from React Icons) */}
        {/* We use 'cursor-pointer' to indicate it's clickable and 'text-2xl' for size. */}
        <HiMenu
          className="text-2xl cursor-pointer"
          onClick={handleMenuToggle}
        />

        {/* YouTube Logo (from React Icons) */}
        <div className="flex items-center text-red-600 space-x-0.5 cursor-pointer">
          <FaYoutube className="text-3xl" />
          <span className="text-xl font-bold tracking-tighter text-black">
            YouTube
          </span>
        </div>
      </div>

      {/* Center Section: Search Bar  */}
      <div className="flex items-center justify-center grow">
        <input
          type="text"
          placeholder="Search"
          // Styling the input field: wide, rounded left corner, gray border, padding
          className="w-1/2 p-2 border border-gray-400 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-600"
          value={searchQuery}
          onChange={handleSearchInput}
        />
        <button
          // Styling the button: border, gray background, rounded right corner, padding
          className="border border-gray-400 p-2 rounded-r-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {/* The search icon is placed inside the button */}
          <FaSearch className="text-xl" />
        </button>
      </div>

      {/* Right Section: Conditional Rendering */}
      <div className="flex items-center space-x-5">
        {isLoggedIn ? (
          // Logged In View
          <>
            <GoUpload className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800" />
            <IoMdNotificationsOutline className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800" />

            {/* User Profile/Name Display */}
            <div className="flex items-center space-x-1 cursor-pointer group">
              {/* Placeholder for Avatar/User Circle */}
              <FaUserCircle className="text-3xl text-gray-700" />
              {/* Display the username from Redux state */}
              <span className="text-sm font-medium text-gray-800 hidden md:inline">
                {username}
              </span>

              {/* Logout button for testing purposes */}
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 ml-3"
              >
                (Logout)
              </button>
            </div>
          </>
        ) : (
          // Logged Out View (Original Sign In Button)
          <>
            <GoUpload className="text-2xl cursor-pointer text-gray-200" />{" "}
            {/* Hide/disable upload icon */}
            <IoMdNotificationsOutline className="text-2xl cursor-pointer text-gray-200" />{" "}
            {/* Hide/disable notification icon */}
            <button
              onClick={handleSignInClick}
              className="flex items-center px-3 py-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <FaUserCircle className="text-xl mr-2" />
              <span className="font-medium text-sm">Sign in</span>
            </button>
          </>
        )}
      </div>

      {/* AuthModal Render */}
      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default Header;
