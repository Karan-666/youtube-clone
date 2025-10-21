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

