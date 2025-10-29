// useFetchChannelDetails.js - Custom hook to fetch a single channel by handle.

import { useState, useEffect } from 'react';
import axios from 'axios';

// The hook accepts the unique handle of the channel it needs to fetch.
const useFetchChannelDetails = (channelHandle) => {
    
    // 1. State to hold the single channel document. Starts as null while loading.
    const [channelDetails, setChannelDetails] = useState(null);
    
    // 2. useEffect runs whenever the component mounts OR the channelHandle changes.
    useEffect(() => {
        
        // Only run if a valid channelHandle is provided.
        if (!channelHandle) return; 

        // Define the URL for our backend API endpoint (GET /api/channel/:handle).
        const API_URL = `http://localhost:8080/api/channel/${channelHandle}`;

        // Define the asynchronous function to fetch the data.
        const fetchDetails = async () => {
            try {
                // Use axios to make a GET request to the specific backend API endpoint.
                const response = await axios.get(API_URL);

                // Check for successful data and update the state.
                if (response.data) {
                    setChannelDetails(response.data);
                }
            } catch (error) {
                // Log the error if the API call fails (e.g., channel handle not found).
                console.error("Failed to fetch channel details:", error.response?.data?.message || error.message);
                setChannelDetails(false); // Set to false to indicate failure/not found.
            }
        };

        // Call the asynchronous function.
        fetchDetails();
    // 3. The dependency array includes channelHandle. The hook reruns if the handle changes.
    }, [channelHandle]); 

    // 4. The hook returns the details (or null/false during loading/failure).
    return channelDetails;
};

export default useFetchChannelDetails;