// Body.jsx - main structure of homepage

import Sidebar from "./Sidebar.jsx";
import VideoCard from "./VideoCard.jsx";
import useFetchVideos from "../hooks/useFetchVideos.js";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../utils/appSlice.js";

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
      {/* Conditionally render the Sidebar based on Redux state. */}     {" "}
      {sideBarVisibility ? <Sidebar /> : null}     {" "}
      {/* The main content area takes up the remaining space. */}     {" "}
      <div className="p-4 grow">
        {/*Filter Button Container (UNCHANGED) */}       {" "}
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
        {/* Video Grid Container  */}       {" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4">
                   {" "}
          {filteredVideos.length === 0 ? (
            <h2 className="col-span-full text-center text-xl font-medium text-gray-500 pt-10">
                            Loading videos or no videos found...            {" "}
            </h2>
          ) : (
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
