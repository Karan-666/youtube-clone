// VideoCard.jsx - Displays the thumbnail and details for a single video on the homepage.

// We will use the Link component to make the entire card clickable, leading to the Video Player Page.
import { Link } from 'react-router-dom';

// The component takes a prop named 'video', which is a single video object from the API.
// We are using prop destructuring
function VideoCard({ video }) {

    // Simple function to format large numbers (e.g 15200 views -> 15.2K views)
    const formatViews = (views) => {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M views';
        }
        if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K views';
        }
        return views + ' views';
    };

    return (
        // The card is a clickable link that navigates to the Video Player Page (URL will use the video's ID).
        <Link to={`/watch/${video._id}`}>
            {/* The card container with minimal styling for padding and hover effect. */}
            <div className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-200">
                
                {/* Thumbnail Image */}
                <img
                    // The video's thumbnailUrl comes directly from the backend data.
                    src={video.thumbnailUrl}
                    alt={video.title}
                    // Styling the image: full width, fixed height, rounded corners.
                    className="w-full h-48 object-cover rounded-xl"
                />
                
                {/* Video Details */}
                <div className="p-2">
                    
                    {/* Title */}
                    <h3 
                        className="text-base font-semibold line-clamp-2"
                        // line-clamp-2 ensures the title is cut off after 2 lines, keeping the grid uniform.
                    >
                        {video.title}
                    </h3>

                    {/* Channel Name  */}
                    <p className="text-sm text-gray-600 mt-1">
                        Channel Name Placeholder 
                    </p>
                    
                    {/* Views and Upload Time (Example using the formatted view count) */}
                    <p className="text-xs text-gray-500">
                        {formatViews(video.views)} • 1 day ago {/* Time is hardcoded for now */}
                    </p>
                    
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;