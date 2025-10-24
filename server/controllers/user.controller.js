import mongoose from "mongoose";
import UserModel from "../models/User.model.js";
import ChannelModel from "../models/Channel.model.js";

//Import bcrypt for hashing (encrypting) user passwords.
import bcrypt from "bcrypt";

//Import jsonwebtoken for creating secure access tokens (JWT).
import jwt from "jsonwebtoken";

// logic for register
export async function register(req, res) {
  try {
    //Destructure the data sent from the frontend in the request body.
    const { username, email, password } = req.body;

    //Find one user where the email matches the provided email.
    const emailCheck = await UserModel.findOne({ email });

    // checking if user already exist
    if (emailCheck) {
      return res.status(409).json({ message: "Email already exist" });
    }

    //password hashing
    // takes 2 argument, password and salt rounds (taken as 10)
    const hashedPassword = bcrypt.hashSync(password, 10);

    // creating new user with hashed password
    const newUser = await UserModel.create({
      username, // if key and value is same, no need write twice
      email,
      password: hashedPassword, // Store the secure hash, NOT the plain text password.
    });

    // sending success reponse
    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    // Handle any server or database errors.
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during registration." });
  }
}

// logic for login
export async function login(req, res) {
  try {
    // Destructure email and password from the request body.
    const { email, password } = req.body;

    // Find one user where the email matches the provided email.
    const existingUser = await UserModel.findOne({ email });

    // If no user is found with that email:
    if (!existingUser) {
      // Return a 404 status code (Not Found) and an error message.
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    // verify the hashed password
    const isValidPassword = bcrypt.compareSync(password, existingUser.password);

    // If the comparison fails (passwords do not match):
    if (!isValidPassword) {
      // Return a 401 status code (Unauthorized) and an error message.
      return res
        .status(401)
        .json({ message: "Invalid credentials (password is wrong)." });
    }

    // generating jwt token

    // payload here = unique data we want to store (user id)
    const payload = {
      id: existingUser._id.toString(),
    };

    // Create the token using the user ID payload and a secret key.
    // We set the expiration for 60 minutes ('60m').
    const accessToken = jwt.sign(payload, "secretkey", {
      expiresIn: "60m", // Token expires after 60 minutes.
    });

    //Send a success response (200 OK) with user info and the access token.
    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: existingUser._id.toString(),
        username: existingUser.username,
        email: existingUser.email,
      },
      accessToken: accessToken, // Send the JWT token to the client.
    });
  } catch (err) {
    // Handle any server or database errors.
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during login." });
  }
}

// we are making create channel function in user controller and not creating a dedicated controller as
// channel creation is tightly attached with the user
// Function to handle creating a new channel for the logged-in user (Protected POST)
export async function createChannel(req, res) {
  try {
    // Get channel data from the request body. We only expect channelName and handle.
    const { channelName, handle } = req.body;
    // Get the authenticated user's ID from the JWT middleware (req.user is available).
    const ownerId = req.user._id;

    // ********************* VALIDATION: Check if user already owns a channel *********************

    // Find a channel where the 'owner' ID matches the logged-in user's ID.
    const existingChannelByUser = await ChannelModel.findOne({
      owner: ownerId,
    });

    if (existingChannelByUser) {
      // Return a 409 Conflict error if the user tries to create a second channel.
      return res.status(409).json({
        message: "User already owns a channel.",
        channel: existingChannelByUser, // Optional: returning the existing channel details.
      });
    }

    // ********************* VALIDATION: Check if channel handle is taken *********************

    // Find a channel where the 'handle' matches the requested handle.
    const existingChannelByHandle = await ChannelModel.findOne({ handle });

    if (existingChannelByHandle) {
      // Return a 409 Conflict error if the handle is already in use.
      return res
        .status(409)
        .json({
          message: "Channel handle is already taken. Please choose another.",
        });
    }

    // ********************* CREATE NEW CHANNEL *********************

    // Create a new document in the 'channels' collection.
    const newChannel = await ChannelModel.create({
      channelName,
      handle,
      owner: ownerId, // Set the owner ID to the authenticated user.
      // Other fields (subscribers, banner) will use their default values.
    });

    // Send a success response (201 Created) back to the client.
    return res.status(201).json({
      message: "Channel created successfully!",
      channel: newChannel,
    });
  } catch (error) {
    // Handle any server or validation errors.
    console.error("Error creating channel:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during channel creation." });
  }
}

// Function to handle fetching details for a specific channel by its unique handle (Public GET)
// I put the controller logic in user.controller.js to simplify development, as the actions are all about the owner.
export async function fetchChannelByHandle(req, res) {
  try {
    // Get the channel handle from the dynamic URL path (e.g., /api/channel/@coder-karan).
    const { handle } = req.params;

    // Use Mongoose to find ONE channel where the 'handle' matches the URL parameter.
    const channelDetails = await ChannelModel.findOne({ handle });

    // Check if the channel was found.
    if (!channelDetails) {
      // If the handle is not found, send a 404 Not Found error.
      return res
        .status(404)
        .json({ message: "Channel not found with this handle." });
    }

    // Send a success response (200 OK) with the channel details.
    return res.status(200).json(channelDetails);
  } catch (error) {
    // Handle any server or database errors.
    console.error("Error fetching channel details:", error);
    return res
      .status(500)
      .json({
        message: "Internal server error while fetching channel details.",
      });
  }
}
