Github Link: https://github.com/Karan-666/youtube-clone

# YouTube Clone Capstone Project: Full Stack Development (MERN)

This is a full-stack video sharing platform built using the MERN Stack (MongoDB, Express, React, Node.js). The application replicates core YouTube features, focusing on:

- Secure user authentication (JWT)
- Dynamic data filtering
- Full CRUD (Create, Read, Update, Delete) functionality for video and comment management

The project fulfills all requirements of MERN stack, using Vite for the frontend setup and ES Modules (import/export) throughout the backend.

---

## Key Features and Deliverables

- **Authentication**: Secure Sign Up/Login using JWT and bcrypt. Header UI dynamically updates profile status.
- **Home Page**: Responsive Header and a toggleable Sidebar. Search by Title and Filter by Category work simultaneously on the video grid.
- **Video Player Page**: Full video player (iframe) integrated with instant comment section CRUD (Add, Edit, Delete). Functional Like/Dislike buttons.
- **Channel Management**: Dedicated owner page allowing Upload, Edit, and Delete operations on user-uploaded videos via modal.
- **Architecture**: Clean separation of concerns using MVC (Model-View-Controller) structure on the backend.

---

## Project Setup and Running Instructions

To run the application, you must start the backend (Node/Express) and frontend (React/Vite) in two separate terminal windows.

### 1. Database Configuration (MongoDB Atlas)

- The project is configured to use a remote MongoDB Atlas cluster.
- **Connection Details**: The connection string is provided directly in `server/index.js`.
- **Seeded Data**: JSON files for the users, videos, and channels collections are available in the `server/db_export` folder for immediate testing. (Seed only for local db testing, the cloud db already have data)
- **Database Name**: `youtube_clone_db`
- **Login Credentials for Testing**: To test the full range of protected features (Upload, Edit, Like, Comment CRUD), please use the pre-registered user:
  - **Role**: Test User (Owner)
  - **Email**: karankumar00619@gmail.com
  - **Password**: 12345

### 2. Backend (Server) Setup

1. Navigate to the server directory: `cd youtube-clone/server`
2. Install dependencies: `npm install`
3. Start the backend server (Port 8080): `npm run start`
4. Console should show: `"Db connection is successful!"`

### 3. Frontend (Client) Setup

1. Open a NEW terminal and navigate to the client directory: `cd youtube-clone/client`
2. Install dependencies: `npm install`
3. Start the frontend application (Port 5173): `npm run dev`

### 4. Final Verification

1. Open your browser to: `http://localhost:5173/`
2. **Test Filtering**: Click the "Music" category button, then search for "Euphoria". The video list should filter instantly.
3. **Test Channel Management**: Log in with the provided credentials and navigate to the Channel Page to perform Upload, Edit, and Delete on the videos.