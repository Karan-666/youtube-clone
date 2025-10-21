// Channel.model.js

import mongoose from 'mongoose';

// Define the Schema for our Channel data.
const channelSchema = new mongoose.Schema({
    // The public name of the channel 
    channelName: {
        type: String,
        required: true, 
        trim: true,
    },
    // The unique handle for the channel (e.g. "@KaranCodes").
    handle: {
        type: String,
        required: true,
        unique: true, // No two channels can have the same handle.
        trim: true,
    },
    // This links the channel to the user who owns it.
    // This reference is a one-to-one relationship (one user owns one channel).
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the 'User' Model.
        required: true,
        unique: true, // A user can only own one channel.
    },
    // Simple description for the channel.
    description: {
        type: String,
        default: "Welcome to my channel!",
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    // The URL for the large banner image on the channel page.
    channelBanner: {
        type: String,
        default: "https://example.com/default/banner.png",
    }
}, {
    // Manages 'createdAt' and 'updatedAt' timestamps.
    timestamps: true 
});

// Create the Model from the Schema.
// Mongoose will use the collection name 'channel'.
const ChannelModel = mongoose.model('Channel', channelSchema);

// Export the Model so we can use it in our controllers.
export default ChannelModel;