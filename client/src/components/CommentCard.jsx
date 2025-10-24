// CommentCard.jsx - Displays a single comment in the comment section.

// We use a general user icon for the commenter's avatar.
import { FaUserCircle } from 'react-icons/fa';

// The component receives a single 'comment' object from the parent map function.
function CommentCard({ comment }) {
    
    // Placeholder function to format the timestamp (e.g 1 day ago).
    const formatTime = (timestamp) => {
        // we return a simple formatted date.
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    return (
        // Comment container
        <div className="flex space-x-3 mb-4">
            
            {/* Avatar Placeholder */}
            <FaUserCircle className="text-3xl text-gray-400 mt-1 flex-shrink-0" />
            
            {/* Comment Content */}
            <div className="flex flex-col">
                
                {/* Username and Timestamp */}
                <div className="flex items-center space-x-2 text-sm mb-1">
                    {/* We are displaying the raw userId for now, as fetching the username 
                        for every comment is complex. We will improve this later. */}
                    <span className="font-semibold text-gray-800">User ID: {comment.userId}</span>
                    <span className="text-gray-500">{formatTime(comment.timestamp)}</span>
                </div>
                
                {/* Comment Text */}
                <p className="text-gray-700 text-sm">{comment.text}</p>

                {/* Placeholder for Reply/Edit/Delete buttons (will be added in a later step) */}
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                    <span className="cursor-pointer hover:text-gray-800">Reply</span>
                    {/* Edit/Delete options will appear here based on ownership. */}
                </div>
            </div>
        </div>
    );
}

export default CommentCard;