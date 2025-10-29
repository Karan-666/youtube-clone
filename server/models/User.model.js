
// Import the mongoose library to define our data structure.
import mongoose from "mongoose";

// simple way (when only type needed)
// const userSchema = new mongoose.Schema({
//     username : String,
//     email : String,
//     password : String
// })

// detailed way
const userSchema = new mongoose.Schema({
    username: {
        type: String, // Data must be a String.
        required: true, // This field cannot be empty.
        trim: true, // Removes whitespace from both ends of a string.
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users can have the same email.
        lowercase: true, // Stores the email in all lowercase.
    },
    password: {
        type: String,
        required: true,
    },
    // Field to track user interactions (videos they've liked or disliked).
    interactions: {
        // An object where the key is the video ID, and the value is the action ('like' or 'dislike').
        // We set the type as a Schema.Types.Mixed to allow flexible key-value storage.
        type: mongoose.Schema.Types.Mixed,
        default: {} // Initialize as an empty object.
    },
}, {
    // This option automatically adds 'createdAt' and 'updatedAt' fields to our documents.
    timestamps: true 
});

// created user model using user collection (table) and userSchema we just defined
const UserModel = mongoose.model('User', userSchema);

export default UserModel;