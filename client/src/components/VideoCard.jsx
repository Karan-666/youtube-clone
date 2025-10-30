// VideoCard.jsx - these will loop over to show video card

import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

// The component takes a prop named 'video', which is a single video object from the API.
// Also accepts various functions as props
function VideoCard({ video, isChannelView, isOwner, onEdit, onRefetch }) {

    // Get token for authorized deletion/edit.
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

    // Function to handle video deletion (Called from the Channel Page).
    async function handleDelete(){
        if (!window.confirm(`Are you sure you want to delete the video: "${video.title}"?`)) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/video/${video._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Video deleted successfully.');

            // Trigger the parent component to refresh the list instantly.
            // basically refetch will do some minor change in state so component re-render
            onRefetch(); 

        } catch (error) {
            console.error('Video deletion failed:', error.response?.data);
            alert(`Deletion Failed: ${error.response?.data?.message || 'Unauthorized or server error.'}`);
        }
    };

    return (
        // The outermost container is now a simple div.
        <div className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-200">
            
            {/* Link the Image/Thumbnail directly to the watch page */}
            <Link to={`/watch/${video._id}`}>
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-xl"
                />
            </Link>
            
            {/* Video Details */}
            <div className="p-2">
                
                {/* 3. Link the Title directly to the watch page */}
                <Link to={`/watch/${video._id}`}>
                    <h3 
                        className="text-base font-semibold line-clamp-2 hover:text-red-700"
                    >
                        {video.title}
                    </h3>
                </Link>


                {/* Owner Actions (CRUD Buttons) - Only visible on the Channel Page for the owner */}
                {isChannelView && isOwner && (
                    <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                        {/* Edit Button opens the modal for the current video data. */}
                        <button 
                            // Prevent default link navigation and call the edit handler.
                            onClick={(e) => { e.preventDefault(); onEdit(video); }}
                            className="hover:text-blue-600 font-medium"
                        >
                            Edit
                        </button>
                        {/* Delete Button calls the deletion API. */}
                        <button 
                            // Prevent default link navigation and call the delete handler.
                            onClick={(e) => { e.preventDefault(); handleDelete(); }}
                            className="hover:text-red-600 font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )}
                
                {/* Standard Info (Channel Name and Views) */}
                {/* Use video.channelId for display of name" */}
                <Link to={`/channel/@coder-karan`}>
                    <p className="text-sm text-gray-600 mt-1 hover:text-black hover:underline">
                        Channel: {video.channelId} 
                    </p>
                </Link>
                {/* for now "1 day ago" is static */}
                <p className="text-xs text-gray-500">
                    {formatViews(video.views)} • 1 day ago 
                </p>
            </div>
        </div>
    );
}

export default VideoCard;