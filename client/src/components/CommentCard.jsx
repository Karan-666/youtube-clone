// CommentCard.jsx - Displays a single comment in the comment section.

// We use a general user icon for the commenter's avatar.
import { FaUserCircle } from "react-icons/fa";
// Import useSelector hook.
import { useSelector } from "react-redux";
// Import axios for API call.
import axios from "axios";
import { useState } from "react";

function CommentCard({ comment, onDelete, videoId, onEditSuccess }) {
  // Local state for handling the edit mode.
  const [isEditing, setIsEditing] = useState(false);
  // Local state to hold the text being edited. Initialize with the original comment text.
  const [editedText, setEditedText] = useState(comment.text);

  // Placeholder function to format the timestamp (eg 1 day ago)
  function formatTime(timestamp) {
    // we return a simple formatted date.
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Retrieve the logged-in user's ID from Redux state.
  // We only need the ID to check ownership.
  const { userId: currentUserId, token } = useSelector((store) => store.user);

  // Check if the currently logged-in user's ID matches the comment owner's ID.
  // Note: The comment object stores the ID as a string, so the comparison is direct.
  const isOwner = currentUserId === comment.userId;

  // Function executed when the user clicks 'Delete'.
  async function handleDeleteClick() {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        // Send the protected DELETE request.
        const response = await axios.delete(
          // API URL: DELETE /api/video/:id/comment
          `http://localhost:8080/api/video/${videoId}/comment`,
          // Configuration object: Must include the Authorization header and the 'data' field.
          // NOTE: For DELETE with a body, axios requires the payload to be nested under 'data'.
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            // Payload containing the comment ID to be deleted.
            data: {
              commentId: comment._id,
            },
          }
        );

        // Check for success (status 200 OK from backend).
        if (response.status === 200) {
          // Call the parent component's callback function to refetch the video details.
          onDelete();
        }
      } catch (error) {
        console.error(
          "Failed to delete comment:",
          error.response?.data?.message || error.message
        );
        alert(`Failed to delete comment. Unauthorized or error occurred.`);
      }
    }
  }

  function handleEditClick() {
    // Toggle the editing mode and ensure the input field contains the current text.
    setIsEditing(true);
    setEditedText(comment.text);
  }

  // submission logic
  async function handleEditSubmit(e) {
    e.preventDefault(); // Prevent submission if text is empty or unchanged.

    if (editedText.trim() === "" || editedText === comment.text) {
      setIsEditing(false);
      return;
    }

    try {
      //Used POST method to edit (as patch was having cors issue)
      const api = `http://localhost:8080/api/video/${videoId}/comment/edit`;
      const body = {
        commentId: comment._id,
        newText: editedText.trim(),
      };
      const headerObject = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(api, body, headerObject);

      // Check for success (status 200 OK from backend).
      if (response.status === 200) {
        // Success: Call the parent component's callback to force a list refresh.
        onEditSuccess();
        // Exit edit mode.
        setIsEditing(false);
      }
    } catch (error) {
      console.error(
        "Failed to edit comment:",
        error.response?.data?.message || error.message
      );
      alert(`Failed to edit comment. Unauthorized or error occurred.`);
    }
  }

  return (
    // Comment container
    <div className="flex space-x-3 mb-4">
      {/* Avatar Placeholder */}
      <FaUserCircle className="text-3xl text-gray-400 mt-1 flex-shrink-0" />

      {/* Comment Content */}
      <div className="flex flex-col w-full">
        {/* Username and Timestamp */}
        <div className="flex items-center space-x-2 text-sm mb-1">
          {/* We are displaying the raw userId for now, as fetching the username 
                        for every comment is complex.*/}
          <span className="font-semibold text-gray-800">
            User ID: {comment.userId}
          </span>
          <span className="text-gray-500">{formatTime(comment.timestamp)}</span>
        </div>

        {/* Conditional Rendering of Text or Edit Form */}
        {isEditing ? (
          // Edit Form Mode
          <form onSubmit={handleEditSubmit} className="flex flex-col space-y-2">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full border-b border-blue-600 focus:outline-none pb-1 text-sm text-gray-700"
              autoFocus
            />
            <div className="flex justify-end space-x-2 text-xs">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              {/* Save Button */}
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-800 font-medium"
                // Disabled if text is empty or unchanged
                disabled={
                  editedText.trim() === "" || editedText === comment.text
                }
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          // Read Mode (Default View)
          <p className="text-gray-700 text-sm">{comment.text}</p>
        )}

        {/* Reply/Edit/Delete buttons (Only show if NOT editing) */}
        {!isEditing && (
          <div className="flex space-x-3 mt-1 text-xs text-gray-500">
            <span className="cursor-pointer hover:text-gray-800">Reply</span>

            {/* Show Edit and Delete only to the owner */}
            {isOwner && (
              <>
                {/* Edit Button */}
                <span
                  onClick={handleEditClick}
                  className="cursor-pointer hover:text-gray-800 ml-4 font-medium"
                >
                  Edit
                </span>

                {/* Delete Button */}
                <span
                  onClick={handleDeleteClick}
                  className="cursor-pointer hover:text-red-600 font-medium"
                >
                  Delete
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
