// video.route.js

import { fetchAllVideos } from "../controllers/video.controller.js";

// This function takes the Express app object and attaches the routes to it.
function videoRoutes(app) {
    
    // Route to fetch all videos for the main homepage grid.
    // get
    // This is a READ operation, so it does NOT need JWT protection.
    app.get('/api/videos', fetchAllVideos);

    // Other video routes (POST/PATCH/DELETE) will be added here later.
}

// Export the function so it can be imported and executed in our index.js file.
export default videoRoutes;