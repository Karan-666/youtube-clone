
import mongoose from "mongoose";
import UserModel from "../models/User.model.js";

//Import bcrypt for hashing (encrypting) user passwords.
import bcrypt from 'bcrypt';

export async function register(req, res){

    try{

        //Destructure the data sent from the frontend in the request body.
        const {username, email, password} = req.body;

        //Find one user where the email matches the provided email.
        const emailCheck = await UserModel.findOne({email});

        // checking if user already exist
        if(emailCheck){
            return res.status(409).json({message: "Email already exist"});
        }

        //password hashing
        // takes 2 argument, password and salt rounds (taken as 10)
        const hashedPassword = bcrypt.hashSync(password, 10)

        // creating new user with hashed password
        const newUser = await UserModel.create({
            username, // if key and value is same, no need write twice
            email,
            password : hashedPassword // Store the secure hash, NOT the plain text password.
        })

        // sending success reponse
         return res.status(201).json({
        message: "User registered successfully!",
            user: { 
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });
    } catch (err) {
        // Handle any server or database errors.
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Internal server error during registration." });
    }
}

export async function login(req, res) {
    
    // This is a placeholder for the actual login logic.
    return res.status(200).json({
        message: "Login controller reached successfully! (Logic coming soon)",
        data: req.body
    });
}