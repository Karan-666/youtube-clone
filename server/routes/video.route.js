// video.route.js - FINAL FIXES

import { createVideo, deleteComment, editComment, fetchVideoDetails, updateLikeDislike, updateVideoPost } from "../controllers/video.controller.js";
import { fetchAllVideos} from "../controllers/video.controller.js"; // Ensure updateVideo is imported correctly
import { deleteVideo , addComment } from "../controllers/video.controller.js";
import verifyToken from "../middleware/verifyToken.js";

function videoRoutes(app) {
  // Route to fetch all videos
  app.get("/api/videos", fetchAllVideos);

  // Route to fetch details for a single video
  app.get('/api/video/:id', fetchVideoDetails);

  // Route to create a new video
  app.post("/api/video", verifyToken, createVideo);

  // Route to update an existing video (POST workaround)
  app.post('/api/video/:id/edit', verifyToken, updateVideoPost); 

    // Route to delete a video.
    app.delete('/api/video/:id', verifyToken, deleteVideo);

    // Route to add a comment to a video
    app.post('/api/video/:id/comment', verifyToken, addComment);

    // Route to delete a comment from a video
    app.delete('/api/video/:id/comment', verifyToken, deleteComment);

    // Route to edit a comment on a video
    app.post('/api/video/:id/comment/edit', verifyToken, editComment);

    // FIX: Route for Liking/Disliking a video 
    app.post('/api/video/:id/interact', verifyToken, updateLikeDislike);
}

export default videoRoutes;