// useFetchVideoDetails.js - Custom hook to fetch a single video by ID.

import { useState, useEffect } from 'react';
import axios from 'axios';

// The hook now accepts the unique ID of the video it needs to fetch.
function useFetchVideoDetails(videoId){
    
    // State to hold the single video document. Starts as null while loading.
    const [videoDetails, setVideoDetails] = useState(null);
    
    // useEffect runs whenever the component mounts OR the videoId changes.
    useEffect(() => {
        
        // Only run if a valid videoId is provided.
        if (!videoId) return; 

        const API_URL = `http://localhost:8080/api/video/${videoId}`;

        // Define the asynchronous function to fetch the data.
        async function fetchDetails(){
            try {
                // Use axios to make a GET request to our specific backend API endpoint.
                const response = await axios.get(API_URL);

                // Check for successful data and update the state.
                if (response.data) {
                    setVideoDetails(response.data);
                }

            } catch (error) {
                // Log the error if the API call fails (e.g., video ID not found).
                console.error("Failed to fetch video details:", error.response?.data?.message || error.message);
                setVideoDetails(false); // Set to false to indicate failure/not found.
            }
        };

        // Call the asynchronous function.
        fetchDetails();
    // The dependency array includes videoId. The hook reruns if the ID changes.
    }, [videoId]); 

    // The hook returns the details (or null/false during loading/failure).
    return videoDetails;
};

export default useFetchVideoDetails;