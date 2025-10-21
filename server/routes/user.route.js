import { login, register } from "../controllers/user.controller.js";


function userRoutes(app){

    // route for registration
    // post
    // it will run register function from controller
    app.post('/api/register', register);

    // route for login
    // post
    // it will run login function from controller
    app.post('/api/login', login);

}

export default userRoutes;