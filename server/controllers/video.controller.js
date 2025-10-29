// video.controller.js

// Import the Video Model so we can interact with the 'videos' collection in MongoDB.
import VideoModel from "../models/Video.model.js";

import mongoose from 'mongoose';

// 1. NEW: Import the User Model.
import UserModel from "../models/User.model.js";

// Function to handle fetching all videos for the homepage grid.
export async function fetchAllVideos(req, res) {
    try {
        // Use the Mongoose .find() method to fetch ALL documents from the 'videos' collection.
        // This is a READ operation, and Mongoose methods return a Promise.
        const allVideos = await VideoModel.find(); 

        // heck if any videos were found.
        if (allVideos.length === 0) {
            // If the array is empty, send a 404 (Not Found) status.
            return res.status(404).json({
                message: "No videos found in the database."
            });
        }
        
        // If videos are found, send a success response (200 OK) with the data.
        return res.status(200).json(allVideos);

    } catch (error) {
        // Handle any server or database errors.
        console.error("Error fetching videos:", error);
        return res.status(500).json({ message: "Internal server error while fetching videos." });
    }
}

// Function to handle creating a new video (Upload/POST operation)
export async function createVideo(req, res) {
    try {
        // Destructure all required fields from the request body.
        const { title, description, videoUrl, thumbnailUrl, channelId, category } = req.body;
        
        // **IMPORTANT:** req.user contains the authenticated user's data 
        // that was attached by the verifyToken middleware
        // This is how we know who uploaded the video.
        const uploaderId = req.user._id; 
        
        // Create a new document in the 'videos' collection.
        // We set the 'uploader' field using the ID from the authenticated user.
        const newVideo = await VideoModel.create({
            title, 
            description, 
            videoUrl, 
            thumbnailUrl, 
            channelId, 
            category,
            uploader: uploaderId, // The ID of the authenticated user.
        });

        // Send a success response (201 Created) back to the client.
        return res.status(201).json(newVideo);

    } catch (error) {
        // Handle any server or validation errors.
        console.error("Error creating video:", error);
        // Send a 400 status if the request body is missing required fields (Mongoose validation error).
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation failed. Please check all required fields." });
        }
        return res.status(500).json({ message: "Internal server error while creating video." });
    }
}

// Function to handle updating an existing video (PATCH operation)
export async function updateVideo(req, res) {
    try {
        // Get the video ID from the dynamic URL path (req.params).
        const { id } = req.params; 
        
        // we will simply find and update the video by ID.
        // In a later step, we will add a check to ensure req.user._id matches the video's uploader ID.

        // Use Mongoose to find the video by its ID and apply updates from req.body.
        const updatedVideo = await VideoModel.findByIdAndUpdate(
            id,              // First argument: The ID of the document to update.
            req.body,        // Second argument: The data fields to change.
            { new: true }    // Third argument: Return the NEW, updated document.
        );

        //  Check if the video was found and updated.
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found with this ID." });
        }

        // Send a success response (200 OK) with the updated document.
        return res.status(200).json(updatedVideo);

    } catch (error) {
        // Handle any server or database errors.
        console.error("Error updating video:", error);
        return res.status(500).json({ message: "Internal server error while updating video." });
    }
}

// Function to handle deleting an existing video (DELETE operation)
export async function deleteVideo(req, res) {
    try {
        // Get the video ID from the dynamic URL path (req.params).
        const { id } = req.params; 
        
        // for now, we will simply find and delete the video by ID.

        // Use Mongoose to find the video by its ID and permanently delete it.
        const deletedVideo = await VideoModel.findByIdAndDelete(
            id // The ID of the document to delete.
        );

        // Check if the video was found and deleted.
        if (!deletedVideo) {
            return res.status(404).json({ message: "Video not found with this ID." });
        }

        // 4. Send a success response (200 OK) with a confirmation message.
        return res.status(200).json({ 
            message: "Video deleted successfully!",
            deletedVideo: deletedVideo // Optional: sending the deleted document for confirmation
        });

    } catch (error) {
        // Handle any server or database errors.
        console.error("Error deleting video:", error);
        return res.status(500).json({ message: "Internal server error while deleting video." });
    }
}

// Function to handle adding a new comment to a specific video (Protected POST)
export async function addComment(req, res) {
    try {
        // Get the video ID from the dynamic URL path.
        const { id } = req.params; 
        // Get the comment text from the request body.
        const { text } = req.body;
        // Get the authenticated user's ID from the JWT middleware.
        const userId = req.user._id;

        // Create the new comment object.
        const newComment = {
            userId: userId, // The ID of the user who is posting the comment.
            text: text,     // The content of the comment.
            timestamp: new Date() // Set the current time.
        };

        // Use $push to atomically add the new comment to the video's comments array.
        const updatedVideo = await VideoModel.findByIdAndUpdate(
            id,              // Find the video by its ID.
            { $push: { comments: newComment } }, // Use $push to append to the 'comments' array.
            { new: true }    // Return the updated video document.
        );

        // Check if the video was found and updated.
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found with this ID. Cannot add comment." });
        }

        // Send a success response (200 OK) with the newly updated video document.
        return res.status(200).json(updatedVideo);

    } catch (error) {
        // Handle any server or database errors.
        console.error("Error adding comment:", error);
        return res.status(500).json({ message: "Internal server error while adding comment." });
    }
}

// Function to handle fetching details for a single video by ID (Public GET)
export async function fetchVideoDetails(req, res) {
    try {
        // Get the video ID from the dynamic URL path.
        const { id } = req.params; 
        
        // Use Mongoose to find ONE video document by its unique ID.
        const video = await VideoModel.findById(id); 

        // Check if the video was found.
        if (!video) {
            return res.status(404).json({ message: "Video not found with this ID." });
        }

        // Send a success response (200 OK) with the video details.
        return res.status(200).json(video);

    } catch (error) {
        // Handle any server or invalid ID errors.
        console.error("Error fetching video details:", error);
        // This handles cases where the ID format is invalid (Mongoose CastError).
        return res.status(400).json({ message: "Invalid video ID format." });
    }
}

// Function to handle deleting a comment from a video (Protected DELETE)
export async function deleteComment(req, res) {
    try {
        // Get the video ID from the URL path.
        const { id: videoId } = req.params; 
        // Get the specific comment ID to be deleted from the request body.
        const { commentId } = req.body; 
        
        // IMPORTANT SECURITY CHECK: Ensure the comment to be deleted belongs to the current user (req.user._id).
        // This is a complex check, and for now, we will perform a direct deletion first. 
        // We assume the frontend only shows the delete button to the owner.

        // Use $pull to remove the comment object from the 'comments' array where 
        // the comment's internal '_id' matches the provided commentId.
        const updatedVideo = await VideoModel.findByIdAndUpdate(
            videoId, 
            {
                // $pull operator removes an element from an array based on a condition.
                $pull: { 
                    comments: { _id: commentId } // Find the comment by its unique MongoDB ID and pull it out.
                }
            },
            { new: true } // Return the updated video document.
        );

        // Check if the video was found. We assume the comment deletion succeeded if the video was found.
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found. Cannot delete comment." });
        }

        // Send a success response (200 OK).
        return res.status(200).json({ 
            message: "Comment deleted successfully!",
            updatedVideo: updatedVideo
        });

    } catch (error) {
        // Handle any server or database errors.
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal server error while deleting comment." });
    }
}

// Function to handle editing an existing comment (Protected PATCH)
export async function editComment(req, res) {
    try {
        // 1. Get the video ID from the URL path.
        const { id: videoId } = req.params; 
        // 2. Get the comment ID and the new text from the request body.
        const { commentId, newText } = req.body; 


        // CRITICAL FIX: Convert commentId string to Mongoose ObjectId for the query.
        const objectCommentId = new mongoose.Types.ObjectId(commentId);
        
        // 3. Use findOneAndUpdate with the Positional Operator ($).
        // This query finds the video by ID AND finds the comment to be updated.
        // It's crucial for atomic updates within nested arrays.
        const updatedVideo = await VideoModel.findOneAndUpdate(
            // Query: Find the video with this ID and where the comments array contains a document 
            // with the specified commentId.
            { _id: videoId, "comments._id": objectCommentId },
            {
                // $set operator is used with the positional operator ($).
                // $ tells MongoDB: "Update the element you just found in the comments array."
                $set: { 
                    "comments.$.text": newText, // Update only the 'text' field of the found comment.
                    "comments.$.timestamp": new Date() // Optionally update the timestamp to reflect the edit time.
                }
            },
            { new: true } // Return the updated video document.
        );

        // 4. Check if the video/comment was found and updated.
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video or Comment not found/authorized for editing." });
        }

        // 5. Send a success response (200 OK).
        return res.status(200).json({ 
            message: "Comment updated successfully!",
            updatedVideo: updatedVideo
        });

    } catch (error) {
        // 6. Handle any server or database errors.
        console.error("Error editing comment:", error);
        return res.status(500).json({ message: "Internal server error while editing comment." });
    }
}

// Function to handle updating the like or dislike count (Protected POST)
export async function updateLikeDislike(req, res) {
    try {
        // 1. Get the video ID from the URL path.
        const { id: videoId } = req.params; 
        // 2. Get the action type ('like' or 'dislike') from the request body.
        const { actionType } = req.body; 

        // Check if the actionType is valid.
        if (actionType !== 'like' && actionType !== 'dislike') {
            return res.status(400).json({ message: "Invalid action type. Must be 'like' or 'dislike'." });
        }
        
        // 3. Determine which field to increment. 
        const updateField = actionType === 'like' ? 'likes' : 'dislikes';
        
        // 4. Use findByIdAndUpdate with the $inc operator (simple increment).
        const updatedVideo = await VideoModel.findByIdAndUpdate(
            videoId, 
            {
                // Increment the chosen field (likes or dislikes) by 1.
                $inc: { [updateField]: 1 } 
            },
            { new: true } // Return the updated video document.
        );

        // 5. Check if the video was found.
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found. Cannot update count." });
        }

        // 6. Send a success response (200 OK).
        return res.status(200).json({ 
            message: `${actionType} count updated successfully!`,
            likes: updatedVideo.likes,
            dislikes: updatedVideo.dislikes
        });

    } catch (error) {
        console.error("Error updating like/dislike count:", error);
        return res.status(500).json({ message: "Internal server error while updating count." });
    }
}