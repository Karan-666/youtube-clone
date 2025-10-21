import { createChannel, login, register } from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";


function userRoutes(app){

    // route for registration
    // post
    // it will run register function from controller
    app.post('/api/register', verifyToken,  register);

    // route for login
    // post
    // it will run login function from controller
    app.post('/api/login', login);

    // route for channel creation
    // post method and protected with token
    app.post('/api/channel' , verifyToken,  createChannel);

}

export default userRoutes;