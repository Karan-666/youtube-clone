// video.route.js

import { createVideo } from "../controllers/video.controller.js";
import { fetchAllVideos } from "../controllers/video.controller.js";
import verifyToken from "../middleware/verifyToken.js";

// This function takes the Express app object and attaches the routes to it.
function videoRoutes(app) {
  // Route to fetch all videos for the main homepage grid.
  // get
  // This is a READ operation, so it does NOT need JWT protection.
  app.get("/api/videos", fetchAllVideos);

  //Route to create a new video
  // The request must pass through verifyToken before it hits the createVideo function.
  app.post("/api/video", verifyToken, createVideo);
}

// Export the function so it can be imported and executed in our index.js file.
export default videoRoutes;
