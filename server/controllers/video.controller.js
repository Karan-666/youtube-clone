// video.controller.js

// Import the Video Model so we can interact with the 'videos' collection in MongoDB.
import VideoModel from "../models/Video.model.js";

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