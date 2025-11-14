# YouTube Clone Capstone Project: Full Stack Development (MERN)

**GitHub Link:** https://github.com/Karan-666/youtube-clone  
**Frontend Deployment:** https://youtube-clone-xi-jade.vercel.app  
**Backend Deployment:** https://youtube-clone-8zd0.onrender.com

## 🎬 Project Overview

This is a comprehensive, full-stack video sharing platform built using the MERN Stack (MongoDB, Express, React, Node.js). The application replicates core YouTube features, focusing on secure user authentication (JWT), dynamic data filtering, and full CRUD (Create, Read, Update, Delete) functionality for video and comment management.

The project fulfills all requirements of the Capstone Assignment, using Vite for the frontend setup and ES Modules (import/export) throughout the backend.

## 🚀 Key Features Implemented

| Module | Core Functionality | Status |
|--------|-------------------|---------|
| **Authentication** | Secure Sign Up/Login using JWT and bcrypt. Header UI dynamically updates profile status. | ✅ Complete |
| **Home Page** | Search by Title and Filter by Category work simultaneously on the video grid. | ✅ Complete |
| **Video Player Page** | Full video player (iframe), functional Like/Dislike buttons, and instant Comment CRUD (Add, Edit, Delete). | ✅ Complete |
| **Channel Management** | Dedicated owner page allowing Upload, Edit, and Delete operations on user-uploaded videos via modal. | ✅ Complete |

## 💻 Backend API Endpoints (Express & JWT Documentation)

The backend adheres to RESTful conventions. All sensitive endpoints are protected by our custom JWT middleware.

| Method | Endpoint | Description | Security |
|--------|----------|-------------|----------|
| `POST` | `/api/login` | Authenticates user and returns a JWT access token. | Public |
| `GET` | `/api/videos` | Fetches all videos for the Home Page grid. | Public |
| `POST` | `/api/video` | **[C]** Uploads a new video document. | JWT Required |
| `POST` | `/api/video/:id/edit` | **[U]** Edits an existing video (Title, URL, etc.). (Used instead of PATCH for stability). | JWT Required |
| `POST` | `/api/video/:id/comment/edit` | **[U]** Edits the text of an existing comment. (Used instead of PATCH for stability). | JWT Required |
| `DELETE` | `/api/video/:id/comment` | **[D]** Removes a specific comment from the video. | JWT Required |

## ⚙️ Project Setup and Running Instructions

The backend is configured to connect to MongoDB Atlas for remote accessibility.

### 1. Database Configuration and Seeded Data

To ensure the evaluator can instantly test all features, the database has been pre-seeded with necessary data:

- **Database:** `youtube_clone_db` (Hosted on MongoDB Atlas)
- **Seeded Data Location:** JSON files for all collections (users, videos, channels) are available in the `server/db_export` folder.

### 🔑 Login Credentials for Testing

| Role | Email | Password |
|------|-------|----------|
| Test User (Owner) | karankumar00619@gmail.com | 12345 |

### 2. Backend (Server) Setup

Navigate to the server directory and start the backend server (Port 8080):

```bash
npm run start
# Must confirm: "Db connection is successful!"
```

### 3. Frontend (Client) Setup

Open a NEW terminal and navigate to the client directory. Start the frontend application (Port 5173):

```bash
npm run dev
```

---

*→ Added video for project demo*