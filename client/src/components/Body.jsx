// Body.jsx - This is the main container for the content grid and sidebar.

// Import the newly created Sidebar component.
import Sidebar from "./Sidebar.jsx";

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
  
  return (
    // Use a flex container to arrange the sidebar and the main content side-by-side.
    // 'mt-14' is added to push the content below the fixed Header (which has a height of h-14).
    <div className="flex mt-14">
      {/* The Sidebar takes up the left-hand column. */}
      <Sidebar />
      {/* The main content area takes up the remaining space. */}
      <div className="p-4 grow">
       {/*Filter Button Container */}
            <div className="flex overflow-x-scroll whitespace-nowrap space-x-3 mb-5 scrollbar-hide">
                {/* Map through the filter buttons to render them dynamically. */}
                {filterButtons.map((filter, index) => (
                    // We must provide a unique key when looping with .map(), as per your notes.
                    <button
                        key={index}
                        // Styling the buttons: rounded, padded, light gray background.
                        // The first one ('All') is styled differently as the active filter.
                        className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-colors 
                                   ${index === 0 ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Video Grid Container (Placeholder) */}
            {/* Tailwind Grid: 4 columns on large screens, 3 on medium, etc. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4">
                {/* Video Cards will be mapped and placed here next. */}
                <h2 className="col-span-full text-center text-xl font-medium text-gray-500 pt-10">
                    Video Grid Placeholder (Fetching Videos Soon)
                </h2>
            </div>
            
        </div>
    </div>
  )
}

// Export the component so it can be used in App.jsx.
export default Body;