// Import jsonwebtoken to verify the token sent by the client.
import jwt from "jsonwebtoken";
// Import the User Model to fetch user details if needed.
import UserModel from "../models/User.model.js";

export default function verifyToken(req, res, next) {
    
    // ************************* CHECK FOR TOKEN IN HEADERS *************************
    
    // The client should send the token in the 'Authorization' header like this: "JWT <token>"
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0]==="Bearer" // Using 'Bearer' as the standard prefix now (for learning, I was using JWT)
    ) {
        
        // ************************* EXTRACT AND VERIFY TOKEN *************************
        
        // Extract the token string (remove "Bearer ").
        const token = req.headers.authorization.split(' ')[1];

        // The jwt.verify() method checks the token's validity and decodes its payload.
        // It uses the same secret key we used to sign the token in the login function.
        jwt.verify(
            token,
            "secretkey", // Must match the secret key used during jwt.sign()
            async function (err, decodedPayload) { // The decodedPayload is the {id: user._id} object.
                if (err) {
                    // If verification fails (e.g., token expired or tampered with).
                    return res.status(403).json({ message: "Invalid or Expired Access Token." });
                }
                
                // ************************* ATTACH USER TO REQUEST *************************
                
                // If verification is successful, we find the user in the database.
                let user = await UserModel.findById(decodedPayload.id);

                // Attach the user object to the request.
                // This makes the user's data available to the final controller function.
                // basically we added user property in request object for further controller and middleware
                req.user = user;                 
                // Tell Express to move to the next function (the final controller logic).
                next();
            }
        );
    } else {
        // If the Authorization header or the token is missing entirely.
        return res.status(401).json({ message: "Access Denied: No Token Provided." });
    }
}