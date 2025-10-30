// We use the 'import' syntax because we set "type": "module" in package.json.
// importing express function (which is framework for our server)
import express from "express";

// Import Mongoose to connect and interact with MongoDB.
import mongoose from "mongoose";

// importing cors
import cors from "cors";

// importing user routes
import userRoutes from "./routes/user.route.js";
import videoRoutes from "./routes/video.route.js";

// the express function gives our app / main application object
const app = express();

// defining port
const PORT = 8080;

// connecting to remote db using mongo db atlast
// 'youtube_clone_db' is the name of our database.
// exported data from local db to folder called db_export in server folder
// imported data to remote mongo db atlas 
const MONGODB_URI = 'mongodb+srv://karankumar00619_db_user:9ik99i5Ayp7oE4sF@cluster0.ddlnnqw.mongodb.net/youtube_clone_db';

///////////////////// MIDDLEWARE SECTION START //////////////////////

// Essential middleware to allow the frontend (client) to communicate with the backend (server).
// This solves the CORS issue, as they run on different ports.
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true, // if you're using cookies or JWT
  })
);

// essential middleware for POST/PATCH/PUT requests to parse incoming JSON bodies.
// Without this, req.body will be undefined in our controllers. (by default)
app.use(express.json());

///////////////////// Middleware ends ////////////////////////

//////////////////// Mongo db connection starts //////////////

// it returns a promise
mongoose.connect(MONGODB_URI).then(() => {
  console.log("Db connection is successful!");

  userRoutes(app);

  videoRoutes(app);

  // app.listen() method starts the server and it keeps it running.
  // it accepts port and a callback function
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
})
.catch(
        // This runs if there is an error during connection.
        (err) => {
            console.log("Error connecting to DB: ", err.message);
        }
    );

// get request
// root route
// app.get("/", (req, res) => {
//   // // res.send() is how the server sends a response back to the client.
//   res.send("<h1>Welcome to youtube clone!</h1>");
// });
