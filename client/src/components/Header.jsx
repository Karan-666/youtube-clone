// Import icons for the hamburger menu and the YouTube logo.
import { HiMenu } from "react-icons/hi";
import { FaYoutube, FaSearch, FaUserCircle } from "react-icons/fa"; // FaUserCircle for the button icon
import { IoMdNotificationsOutline } from "react-icons/io";
import { GoUpload } from "react-icons/go"; // Icon for uploading a video (placeholder)
import { Link } from "react-router-dom"; // We'll need Link for the Sign-in button
import React, { useState } from "react"; // Import useState for modal visibility
import AuthModal from "./AuthModal";
import { useDispatch } from "react-redux";
import { toggleMenu } from "../utils/appSlice.js";

function Header() {
  // Local state to control whether the Sign-in Modal is visible (false = hidden initially).
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Hook to allow sending actions to the Redux store (used for sidebar toggle).
  const dispatch = useDispatch();

  //Function to handle the sidebar toggle click.
  function handleMenuToggle() {
    dispatch(toggleMenu());
  }

  //Function to handle the Sign-in button click.
  function handleSignInClick() {
    setShowAuthModal(true);
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
        />
        <button
          // Styling the button: border, gray background, rounded right corner, padding
          className="border border-gray-400 p-2 rounded-r-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {/* The search icon is placed inside the button */}
          <FaSearch className="text-xl" />
        </button>
      </div>

      {/* Right Section: User Icons and Sign-in Button */}
      <div className="flex items-center space-x-5">
        {/* Placeholder icons for logged-in user actions (Will be conditionally rendered later) */}
        <GoUpload className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800" />
        <IoMdNotificationsOutline className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800" />

        {/* Attach handleSignInClick to the button. */}
        <button
          onClick={handleSignInClick}
          className="flex items-center px-3 py-1 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
        >
          <FaUserCircle className="text-xl mr-2" />
          <span className="font-medium text-sm">Sign in</span>
        </button>
      </div>

      {/* Render the AuthModal at the end of the component's JSX. */}
      {/* The modal is rendered but hidden if showAuthModal is false. */}
      <AuthModal
        isVisible={showAuthModal}
        // This function allows the modal's internal close button to update the state here.
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default Header;
