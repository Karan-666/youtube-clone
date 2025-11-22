// Displays the main navigation menu (Home, Subscriptions, Library, etc.).
// The sidebar is static, not fully functional for now

// Import icons for the main navigation sections.
import { AiFillHome, AiOutlineFire } from 'react-icons/ai'; 
import { MdOutlineSubscriptions, MdOutlineVideoLibrary } from 'react-icons/md'; 
import { FaUserCircle } from "react-icons/fa"; 
import { Link } from 'react-router-dom'; 
import { useSelector } from 'react-redux';

function Sidebar() {
    const { isLoggedIn } = useSelector((store) => store.user);
    const ownerHandle = "@coder-karan"; 

  return (
    //h-[calc(100vh-3.5rem)] -> Sets the height of the sidebar. 
    // 100vh means 100% of the viewport (screen) height. 
    // We then subtract the height of the fixed header (h-14 which is 3.5rem) 
    // so the sidebar starts exactly below the header and runs all the way to the bottom of the screen.
    // overflow-y-auto-> If the content inside the sidebar gets too long to fit vertically, this enables a vertical scrollbar (y-auto) for the sidebar only.
    <div className="p-5 shadow-lg flex-shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto w-48 sticky top-14 bg-white">
      
      {/* Main Section (Home, Trending, Subscriptions) */}
      <div className="pb-4 border-b">
        <ul className="space-y-3">
          {/* Home Link */}
          <Link to="/">
            <li className="flex items-center text-sm font-bold cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
              <AiFillHome className="text-xl mr-3" />
              <span>Home</span>
            </li>
          </Link>
          
          {/* Trending Link*/}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <AiOutlineFire className="text-xl mr-3" />
            <span>Trending</span>
          </li>

          {/* Subscriptions Link*/}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <MdOutlineSubscriptions className="text-xl mr-3" />
            <span>Subscriptions</span>
          </li>
        </ul>
      </div>

      {/* 'You' Section (Library, History)*/}
      <div className="pt-4 pb-4 border-b">
        <h3 className="font-bold text-base mb-2">You</h3>
        <ul className="space-y-3">
            {/* Library Link */}
          <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <MdOutlineVideoLibrary className="text-xl mr-3" />
            <span>Library</span>
          </li>
          {/*Channel Page Link */}
            <Link to={isLoggedIn ? `/channel/${ownerHandle}` : `/auth/login`}> 
            <li className="flex items-center text-sm font-medium cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
              <FaUserCircle className="text-xl mr-3" />
              <span>Your Channel</span>
            </li>
            </Link>
        </ul>
      </div>
      
      {/* Explore Section */}
      <div className="pt-4">
        <h3 className="font-bold text-base mb-2">Explore</h3>
        <p className="text-sm text-gray-500">Music, Gaming, News...</p>
      </div>

    </div>
  )
}

export default Sidebar;