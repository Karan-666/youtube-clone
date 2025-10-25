// CommentCard.jsx - Displays a single comment in the comment section.

// We use a general user icon for the commenter's avatar.
import { FaUserCircle } from "react-icons/fa";

// Import useSelector hook.
import { useSelector } from "react-redux";

// Import axios for API call.
import axios from 'axios';

// The component receives a single 'comment' object from the parent map function.
function CommentCard({ comment , onDelete, videoId }) {
  // Placeholder function to format the timestamp (e.g 1 day ago).
  const formatTime = (timestamp) => {
    // we return a simple formatted date.
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Retrieve the logged-in user's ID from Redux state.
  // We only need the ID to check ownership.
  const currentUserId = useSelector((store) => store.user.userId);

  const token = useSelector(store => store.user.token);

  // Check if the currently logged-in user's ID matches the comment owner's ID.
  // Note: The comment object stores the ID as a string, so the comparison is direct.
  const isOwner = currentUserId === comment.userId;

  // Function executed when the user clicks 'Delete'.
    const handleDeleteClick = async () => {
        if(window.confirm("Are you sure you want to delete this comment?")) {
            
            try {
                // 3. Send the protected DELETE request.
                const response = await axios.delete(
                    // API URL: DELETE /api/video/:id/comment
                    `http://localhost:8080/api/video/${videoId}/comment`,
                    // 4. Configuration object: Must include the Authorization header and the 'data' field.
                    // NOTE: For DELETE with a body, axios requires the payload to be nested under 'data'.
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        },
                        // Payload containing the comment ID to be deleted.
                        data: {
                            commentId: comment._id 
                        }
                    }
                );

                // 5. Check for success (status 200 OK from backend).
                if (response.status === 200) {
                    // Call the parent component's callback function to refetch the video details.
                    onDelete(); 
                }

            } catch (error) {
                console.error("Failed to delete comment:", error.response?.data?.message || error.message);
                alert(`Failed to delete comment. Unauthorized or error occurred.`);
            }
        }
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
          <span className="font-semibold text-gray-800">
            User ID: {comment.userId}
          </span>
          <span className="text-gray-500">{formatTime(comment.timestamp)}</span>
        </div>

        {/* Comment Text */}
        <p className="text-gray-700 text-sm">{comment.text}</p>

        {/* 6. Reply/Edit/Delete buttons */}
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                    <span className="cursor-pointer hover:text-gray-800">Reply</span>
                    
                    {/* Conditionally render the Delete button if the user is the owner. */}
                    {isOwner && (
                        <span 
                            onClick={handleDeleteClick} // NEW: Attach the delete logic here.
                            className="cursor-pointer hover:text-red-600 font-medium ml-4"
                        >
                            Delete
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommentCard;