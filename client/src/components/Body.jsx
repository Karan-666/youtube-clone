// Body.jsx - main structure of homepage

import Sidebar from "./Sidebar.jsx";
import VideoCard from "./VideoCard.jsx";
import useFetchVideos from "../hooks/useFetchVideos.js";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../utils/appSlice.js";

// ---Simple Shimmer Component (The Loader) ---
const ShimmerCard = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* Thumbnail placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="flex gap-2">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
        <div className="flex flex-col w-full gap-2">
          {/* Title placeholder */}
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
          {/* Channel name placeholder */}
          <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Array of filter buttons
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
  const dispatch = useDispatch();

  // getting value of states from app slice
  const searchQuery = useSelector((store) => store.app.searchQuery);
  const sideBarVisibility = useSelector((store) => store.app.isMenuOpen);
  const selectedCategory = useSelector((store) => store.app.selectedCategory);

  // getting video list from custom hook
  const videos = useFetchVideos();

  // when component render we get filtered videos
  const filteredVideos = videos.filter((video) => {
    // filtering by search
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // filtering by category
    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;

    // return when both cases are true
    return matchesSearch && matchesCategory;
  });

  // Function to handle filter button clicks.
  function handleFilterClick(category) {
    dispatch(setCategory(category));
  }

  return (
    // Added min-h to ensure content pushes below the fixed header
    <div className="flex mt-14 min-h-[calc(100vh-3.5rem)]">
      {/* Conditionally render the Sidebar based on Redux state. */}      {" "}
      {sideBarVisibility ? <Sidebar /> : null}      {" "}
      {/* The main content area takes up the remaining space. */}      {" "}
      <div className="p-4 grow">
        {/*Filter Button Container (UNCHANGED) */}        {" "}
        <div className="flex overflow-x-scroll whitespace-nowrap space-x-3 mb-5 scrollbar-hide">
          {" "}
          {filterButtons.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-colors
      ${
        filter.toLowerCase() === selectedCategory.toLowerCase()
          ? // selected category will get black
            "bg-black text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
            >
              {filter}
            </button>
          ))}
          {" "}
        </div>
        {/* Video Grid Container  */}        {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4">
          {" "}
          {/* LOGIC UPDATE: If main videos list is empty, show Shimmer. If filtered is empty, show text. */}
          {videos.length === 0 ? (
            // Show 10 Shimmer cards while loading
            Array(10)
              .fill("")
              .map((_, index) => <ShimmerCard key={index} />)
          ) : filteredVideos.length === 0 ? (
            // Data loaded, but search/filter found nothing
            <h2 className="col-span-full text-center text-xl font-medium text-gray-500 pt-10">
              No videos found for "{searchQuery}"
            </h2>
          ) : (
            // Show actual videos
            filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          )}
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </div>
  );
}

export default Body;