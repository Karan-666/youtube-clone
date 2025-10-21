// Import mongoose to define the data structure and the Schema types.
import mongoose from 'mongoose';

// Define the Schema for our video data.
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // A video must have a title.
        trim: true,
        maxlength: 100, // Keep titles readable.
    },
    description: {
        type: String,
        default: "No description provided.",
    },
    // The actual URL of the video file (a link to an external video service).
    videoUrl: { 
        type: String,
        required: true,
    },
    // The URL of the image displayed on the homepage (the thumbnail).
    thumbnailUrl: { 
        type: String,
        required: true,
    },
    // This links the video to the user who uploaded it.
    // We store the ID of the User document in the 'users' collection.
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' Model.
        required: true,
    },
    // The unique ID of the channel this video belongs to.
    channelId: {
        type: String, 
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    // We will use a simple string for categorization (e.g., 'Tech', 'Music', 'Gaming').
    category: { 
        type: String,
        default: 'General',
    },
    comments: [
        {
            // The ID of the user who posted the comment (links to the 'users' collection).
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', 
                required: true,
            },
            // The actual text content of the comment.
            text: {
                type: String,
                required: true,
                maxlength: 500,
            },
            // The time the comment was posted.
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }
    ],
}, {
    // This automatically manages 'createdAt' and 'updatedAt' timestamps.
    timestamps: true 
});

// Create the Model from the Schema.
// Mongoose will use the collection name 'videos'.
const VideoModel = mongoose.model('Video', videoSchema);

// Export the Model so we can use it in our controllers.
export default VideoModel;