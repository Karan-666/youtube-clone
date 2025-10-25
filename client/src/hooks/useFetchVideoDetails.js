// useFetchVideoDetails.js - Custom hook to fetch a single video by ID.

import { useState, useEffect } from "react";
import axios from "axios";

// The hook now accepts the unique ID of the video it needs to fetch.
function useFetchVideoDetails(videoId, refetchTrigger) {
  // State to hold the single video document. Starts as null while loading.
  const [videoDetails, setVideoDetails] = useState(null);

  // useEffect runs whenever the component mounts OR the videoId changes.
  useEffect(() => {
    // Only run if a valid videoId is provided.
    if (!videoId) return;

    const API_URL = `http://localhost:8080/api/video/${videoId}`;

    // Define the asynchronous function to fetch the data.
    async function fetchDetails() {
      try {
        const response = await axios.get(API_URL);
        if (response.data) {
          setVideoDetails(response.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch video details:",
          error.response?.data?.message || error.message
        );
        setVideoDetails(false);
      }
    }

    // Call the asynchronous function.
    fetchDetails();

    // 2. NEW: The dependency array now includes refetchTrigger.
    // Changing this state variable forces a refresh of the video details (including new comments).
  }, [videoId, refetchTrigger]);

  // The hook returns the details.
  return videoDetails;
}

export default useFetchVideoDetails;
