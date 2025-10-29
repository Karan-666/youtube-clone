// video.route.js

import { createVideo, deleteComment, editComment, fetchVideoDetails, updateLikeDislike } from "../controllers/video.controller.js";
import { fetchAllVideos } from "../controllers/video.controller.js";
import { updateVideo, deleteVideo , addComment } from "../controllers/video.controller.js";
import verifyToken from "../middleware/verifyToken.js";

// This function takes the Express app object and attaches the routes to it.
function videoRoutes(app) {
  // Route to fetch all videos for the main homepage grid.
  // get
  // This is a READ operation, so it does NOT need JWT protection.
  app.get("/api/videos", fetchAllVideos);

  //Route to fetch details for a single video (Public GET operation).
    // This uses the same URL structure as the protected update/delete routes, but is a GET request.
    app.get('/api/video/:id', fetchVideoDetails);

  //Route to create a new video
  // The request must pass through verifyToken before it hits the createVideo function.
  app.post("/api/video", verifyToken, createVideo);

  // Route to update an existing video (Protected Update/PATCH operation).
    // The ':id' is a dynamic parameter that captures the video ID from the URL.
    app.post('/api/video/:id/edit', verifyToken, updateVideo);

    // Route to delete a video.
    app.delete('/api/video/:id', verifyToken, deleteVideo);

    // Route to add a comment to a video (Protected POST operation).
    // The ':id' is the video ID.
    app.post('/api/video/:id/comment', verifyToken, addComment);

    //Route to delete a comment from a video (Protected DELETE operation).
    // The ':id' is the video ID. The comment ID is passed in req.body.
    app.delete('/api/video/:id/comment', verifyToken, deleteComment);

    // Route to edit a comment on a video (Protected PATCH operation).
    // The ':id' is the video ID. The comment ID and new text are passed in req.body.
    app.patch('/api/video/:id/comment', verifyToken, editComment);

    // i. NEW: Route for Liking/Disliking a video (Protected POST operation).
    // The ':id' is the video ID. The actionType ('like'/'dislike') is passed in req.body.
    app.post('/api/video/:id/interact', verifyToken, updateLikeDislike);
}

// Export the function so it can be imported and executed in our index.js file.
export default videoRoutes;
