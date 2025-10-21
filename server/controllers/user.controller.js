
import UserModel from "../models/User.model.js";

export async function register(req, res){

    return res.status(200).json({
        message: "Registration controller reached successfully!",
        data: req.body
    })
}

export async function login(req, res) {
    
    // This is a placeholder for the actual login logic.
    return res.status(200).json({
        message: "Login controller reached successfully! (Logic coming soon)",
        data: req.body
    });
}