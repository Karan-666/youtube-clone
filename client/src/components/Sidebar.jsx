// Displays the main navigation menu (Home, Subscriptions, Library, etc.).

// Import icons for the main navigation sections.
import { AiFillHome, AiOutlineFire } from 'react-icons/ai'; // Home, Trending
import { MdOutlineSubscriptions, MdOutlineVideoLibrary } from 'react-icons/md'; // Subscriptions, Library
import { FaUserCircle } from "react-icons/fa"; // You/Profile Section

function Sidebar() {
  return (
    // The Sidebar container: fixed width, full height (relative to its parent).
    // The 'col-span-1' is a placeholder for when we use a grid in the Body.
    <div className="p-5 w-48 shadow-lg h-full overflow-y-auto">
      
      {/* Main Section (Home, Trending, Subscriptions) */}
      <div className="pb-4 border-b">
        <ul className="space-y-3">
          {/* Home Link */}
          <li className="flex items-center text-sm font-bold cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <AiFillHome className="text-xl mr-3" />
            <span>Home</span>
          </li>
          
          {/* Trending Link */}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <AiOutlineFire className="text-xl mr-3" />
            <span>Trending</span>
          </li>

          {/* Subscriptions Link */}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <MdOutlineSubscriptions className="text-xl mr-3" />
            <span>Subscriptions</span>
          </li>
        </ul>
      </div>

      {/* 'You' Section (Library, History) - Only visible when logged in */}
      <div className="pt-4 pb-4 border-b">
        <h3 className="font-bold text-base mb-2">You</h3>
        <ul className="space-y-3">
            {/* Library Link */}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <MdOutlineVideoLibrary className="text-xl mr-3" />
            <span>Library</span>
          </li>
          {/* Channel Page Link - This will link to the user's Channel Page later */}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <FaUserCircle className="text-xl mr-3" />
            <span>Your Channel</span>
          </li>
        </ul>
      </div>
      
      {/* Explore Section (Placeholder) */}
      <div className="pt-4">
        <h3 className="font-bold text-base mb-2">Explore</h3>
        {/* Placeholder for category filters */}
        <p className="text-sm text-gray-500">Music, Gaming, News...</p>
      </div>

    </div>
  )
}

export default Sidebar;