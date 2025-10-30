// Import icons for the hamburger menu and the YouTube logo.
import { HiMenu } from "react-icons/hi";
import { FaYoutube, FaSearch, FaUserCircle } from "react-icons/fa"; 
import { IoMdNotificationsOutline } from "react-icons/io";
import { GoUpload } from "react-icons/go"; 
import { Link } from "react-router-dom"; 
import { useState } from "react"; 
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu, setSearchQuery } from "../utils/appSlice.js";
import { logoutUser } from "../utils/userSlice.js";
import VideoManagementModal from "./VideoManagementModal.jsx"; 

function Header() {
  // Local state to control modal visibility.
  // need below states as upload and login button are in header.
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false); 

  // Hook to allow actions to the Redux store.
  const dispatch = useDispatch();

  // Subscribe to user and search state.
  const { isLoggedIn, username } = useSelector((store) => store.user);
  const searchQuery = useSelector(store => store.app.searchQuery);

  // Hardcoded handle for quick navigation.
  const ownerHandle = "@coder-karan";

  // Function to handle the sidebar toggle click.
  // we are getting toggle menu from app slice
  function handleMenuToggle() {
    dispatch(toggleMenu());
  }

  // Function to handle the Sign-in button click.
  // opens the login / sign in modal (dialog form)
  function handleSignInClick() {
    setShowAuthModal(true);
  }

  // Logout handler.
 // getting this action from user slice
  function handleLogout(){
    dispatch(logoutUser());
  };

  // Function to handle search input change.
 // we have stored search state in app slice
  function handleSearchInput(e){
    dispatch(setSearchQuery(e.target.value));
  }
  
  // function for upload button click.
  function handleUploadClick() {
    setShowUploadModal(true);
  }

  return (
    // The main header container, fixed at top.
    <div className="flex justify-between h-14 bg-white p-3 shadow-md fixed w-full z-10 top-0">
      {/*Left Section: Menu Icon and Logo */}
      <div className="flex items-center space-x-4">
        <HiMenu
          className="text-2xl cursor-pointer"
          onClick={handleMenuToggle}
        />
        {/* clicking youtube logo transition back to the Home Page */}
        <Link to="/">
          <div className="flex items-center text-red-600 space-x-0.5 cursor-pointer">
            <FaYoutube className="text-3xl" />
            <span className="text-xl font-bold tracking-tighter text-black">
              YouTube
            </span>
          </div>
        </Link>
      </div>

      {/* Center Section: Search Bar */}
      {/* both search box and search button have height 10 to look equal and merge */}
      <div className="flex items-center justify-center grow max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 border border-gray-400 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-600 pl-4"
          value={searchQuery}
          onChange={handleSearchInput}
        />
        <button
          className="h-10 border border-gray-400 border-l-0 p-2 rounded-r-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 flex items-center justify-center"
        >
          <FaSearch className="text-xl" />
        </button>
      </div>

      {/* Right Section: Conditional Rendering */}
      <div className="flex items-center space-x-5">
        {isLoggedIn ? (
          // Logged In View -> how button look after login
          <>
            {/* Upload Button opens modal */}
            <GoUpload 
                onClick={handleUploadClick} 
                className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800" 
            />
            <IoMdNotificationsOutline className="text-2xl cursor-pointer text-gray-600 hover:text-gray-800" />

            {/* User Profile now links to Channel Page for now (as I had not dedicated made profile page) */}
            <Link to={`/channel/${ownerHandle}`} className="flex items-center space-x-1 cursor-pointer group">
              <FaUserCircle className="text-3xl text-gray-700" />
              <span className="text-sm font-medium text-gray-800 hidden md:inline">
                {username}
              </span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:text-red-700 ml-3"
            >
              (Logout)
            </button>
          </>
        ) : (
          // Logged Out View -> how button look after log-out
          <>
            <GoUpload className="text-2xl cursor-pointer text-gray-200" />
            <IoMdNotificationsOutline className="text-2xl cursor-pointer text-gray-200" />
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
        {/* Render Upload Modal */}
        <VideoManagementModal
            isVisible={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            isEditMode={false}
            onVideoSaved={() => alert('Video Uploaded')}
        />
    </div>
  );
}

export default Header;