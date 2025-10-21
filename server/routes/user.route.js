import {
  createChannel,
  fetchChannelByHandle,
  login,
  register,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

function userRoutes(app) {
  // route for registration
  // post
  // it will run register function from controller
  app.post("/api/register", verifyToken, register);

  // route for login
  // post
  // it will run login function from controller
  app.post("/api/login", login);

  // route for channel creation
  // post method and protected with token
  app.post("/api/channel", verifyToken, createChannel);

  // route to fectch all channels
  // get method and public, no token needed
  // :handle is dynamic parameter for channel unique name
  app.get("/api/channel/:handle", fetchChannelByHandle);
}

export default userRoutes;
