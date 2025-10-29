// VideoCard.jsx - Displays the thumbnail and details for a single video on the homepage.

// We will use the Link component to make the entire card clickable, leading to the Video Player Page.
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useSelector } from 'react-redux';

// The component takes a prop named 'video', which is a single video object from the API.
// We are using prop destructuring
function VideoCard({ video, isChannelView, isOwner, onEdit, onRefetch }) {

    // 1. NEW: Get token for authorized deletion.
    const token = useSelector((store) => store.user.token);

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

    // 2. NEW: Function to handle video deletion.
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the video: "${video.title}"?`)) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/video/${video._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Video deleted successfully.');
            onRefetch(); // Trigger the parent component to refresh the list.
        } catch (error) {
            console.error('Video deletion failed:', error.response?.data);
            alert(`Deletion Failed: ${error.response?.data?.message || 'Unauthorized or server error.'}`);
        }
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

                    {/* Owner Actions (NEW) - Visible ONLY on the Channel Page for the owner */}
                    {isChannelView && isOwner && (
                        <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                            {/* Edit Button opens the modal for the current video data. */}
                            <button 
                                onClick={(e) => { e.preventDefault(); onEdit(video); }}
                                className="hover:text-blue-600 font-medium"
                            >
                                Edit
                            </button>
                            {/* Delete Button calls the deletion API. */}
                            <button 
                                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                                className="hover:text-red-600 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                    
                    {/* Standard Info - Only visible if NOT in Channel View (or if user is not owner) */}
                    {!isChannelView && (
                        <>
                            <p className="text-sm text-gray-600 mt-1">Channel Name Placeholder</p>
                            <p className="text-xs text-gray-500">{formatViews(video.views)} • 1 day ago</p>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;