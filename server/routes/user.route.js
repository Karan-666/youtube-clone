

function userRoutes(App){

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