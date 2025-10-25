// AddCommentForm.jsx - Allows logged-in users to submit new comments.

import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

// The form needs props for the ID of the video it's commenting on, 
// and a function to refetch comments after submission.
function AddCommentForm({ videoId, onCommentAdded }) {
    
    // State to manage the text typed into the comment box.
    const [commentText, setCommentText] = useState('');
    
    // Read the authentication state from Redux.
    const { isLoggedIn } = useSelector((store) => store.user);

    // Placeholder for the form submission logic (will be implemented next).
    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return; // Prevent empty comments.
        
        console.log(`Submitting comment for Video ID ${videoId}: ${commentText}`);
        // Logic to call the protected POST /api/video/:id/comment API will go here.
        
        // Reset the form after submission (placeholder for now).
        setCommentText('');
    };

    // If the user is NOT logged in, show a simple message and return early.
    if (!isLoggedIn) {
        return (
            <div className="flex justify-start items-center p-3 my-4 bg-gray-50 border rounded-lg">
                <FaUserCircle className="text-3xl text-red-500 mr-3" />
                <p className="text-sm text-gray-700">
                    Please <span className="font-bold text-red-600">Sign In</span> to post a comment.
                </p>
            </div>
        );
    }
    
    return (
        <div className="flex space-x-3 my-4">
            {/* User Avatar Placeholder */}
            <FaUserCircle className="text-4xl text-gray-500 flex-shrink-0 mt-1" />
            
            {/* Comment Input Form */}
            <form onSubmit={handleSubmit} className="w-full">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    // This creates the controlled component.
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-600 pb-1 text-base"
                />
                
                {/* Action Buttons (Visible only when text is entered) */}
                {commentText.length > 0 && (
                    <div className="flex justify-end space-x-3 mt-2">
                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={() => setCommentText('')}
                            className="text-sm text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded font-medium disabled:bg-blue-300"
                            disabled={commentText.trim() === ''} // Button is disabled for empty comments.
                        >
                            Comment
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AddCommentForm;