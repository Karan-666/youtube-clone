// Body.jsx - This is the main container for the content grid and sidebar.

import Sidebar from "./Sidebar.jsx";
// Import the VideoCard component.
import VideoCard from "./VideoCard.jsx";
// Import the custom hook to fetch videos.
import useFetchVideos from "../hooks/useFetchVideos.js";
import { useSelector } from "react-redux";

// Array of filter buttons (at least 6, as required by the project).
const filterButtons = [
  "All",
  "Web Development",
  "JavaScript",
  "React",
  "Music",
  "Gaming",
  "News",
  "Live",
];

function Body() {
  // Call the custom hook to get the list of videos.
  const videos = useFetchVideos();

  // getting value of isMenuOpen redux state from app slice
  const sideBarVisibility = useSelector(store => store.app.isMenuOpen);

  // Show a loading state if videos array is empty (or we can show the filters).
  return (
    // Use flex to arrange the sidebar and the main content.
    <div className="flex mt-14">
      {/* Conditionally render the Sidebar based on Redux state. */}
      {sideBarVisibility?<Sidebar /> : null}

      {/* The main content area takes up the remaining space (Video Filters + Grid). */}
      <div className="p-4 grow">
        {/*Filter Button Container */}
        <div className="flex overflow-x-scroll whitespace-nowrap space-x-3 mb-5 scrollbar-hide">
          {/* Map through the filter buttons to render them dynamically. */}
          {filterButtons.map((filter, index) => (
            // We must provide a unique key when looping with .map()
            <button
              key={index}
              // Styling the buttons: rounded, padded, light gray background.
              // The first one ('All') is styled differently as the active filter.
              className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-colors
                        ${
                          index === 0
                            ? "bg-black text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Video Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4">
          {/* Show a message if no videos are available yet. */}
          {videos.length === 0 ? (
            <h2 className="col-span-full text-center text-xl font-medium text-gray-500 pt-10">
              Loading videos or no videos found...
            </h2>
          ) : (
            // Map through the fetched videos and render a VideoCard for each.
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          )}
        </div>
      </div>
    </div>
  );
}

// Export the component so it can be used in App.jsx.
export default Body;
