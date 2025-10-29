// Body.jsx - This is the main container for the content grid and sidebar.

import Sidebar from "./Sidebar.jsx";
// Import the VideoCard component.
import VideoCard from "./VideoCard.jsx";
// Import the custom hook to fetch videos.
import useFetchVideos from "../hooks/useFetchVideos.js";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../utils/appSlice.js";

// Array of filter buttons (at least 6, as required by the project).
const filterButtons = [
  "All",
  "Web Development",
  "Tech",
  "JavaScript",
  "React",
  "Music",
  "Gaming",
  "News",
  "Live",
];

function Body() {
  const searchQuery = useSelector((store) => store.app.searchQuery);

  // getting value of isMenuOpen redux state from app slice
  const sideBarVisibility = useSelector((store) => store.app.isMenuOpen);

  // Retrieve the selected category
  const selectedCategory = useSelector((store) => store.app.selectedCategory);

  // Call the custom hook to get the list of videos.
  const videos = useFetchVideos();

  const dispatch = useDispatch();

  // .filter() creates a new array containing only elements that pass the test.
  const filteredVideos = videos.filter(
    video => {
        
        // --- CRITERIA 1: Search by Title (Case-Insensitive) ---
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());

        // --- CRITERIA 2: Filter by Category ---
        // If the selected category is "All", this returns true (no category filter applied).
        // Otherwise, it checks if the video's category matches the selected category exactly.
        const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;

        // The video is included only if BOTH criteria are true.
        return matchesSearch && matchesCategory;
    }
  );

  // Function to handle filter button clicks.
  function handleFilterClick(category) {
    // // Dispatch the setCategory action, passing the category name as the payload.
    dispatch(setCategory(category));
  }

  // Show a loading state if videos array is empty (or we can show the filters).
  return (
    // Use flex to arrange the sidebar and the main content.
    <div className="flex mt-14">
      {/* Conditionally render the Sidebar based on Redux state. */}
      {sideBarVisibility ? <Sidebar /> : null}

      {/* The main content area takes up the remaining space (Video Filters + Grid). */}
      <div className="p-4 grow">
        {/*Filter Button Container */}
        <div className="flex overflow-x-scroll whitespace-nowrap space-x-3 mb-5 scrollbar-hide">
          {/* Map through the filter buttons to render them dynamically. */}
          {filterButtons.map((filter, index) => (
            // We must provide a unique key when looping with .map()
            // We use the filter name as the unique key.
            <button
              key={filter}
              // 7. NEW: Attach the click handler, passing the filter name as a custom argument.
              onClick={() => handleFilterClick(filter)}
              // 8. NEW: Apply 'bg-black' style if this filter matches the Redux state.
              className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-colors 
                                   ${
                                     filter === selectedCategory
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
          {filteredVideos.length === 0 ? (
            <h2 className="col-span-full text-center text-xl font-medium text-gray-500 pt-10">
              Loading videos or no videos found...
            </h2>
          ) : (
            // Map through the fetched videos and render a VideoCard for each.
            filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Export the component so it can be used in App.jsx.
export default Body;
