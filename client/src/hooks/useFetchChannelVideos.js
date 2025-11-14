// useFetchChannelVideos.js - Custom hook to fetch all videos uploaded by a specific channel owner.

import { useState, useEffect } from 'react';
import axios from 'axios';
// import the hook we just created to get the channel's owner ID.
import useFetchChannelDetails from './useFetchChannelDetails';

// This hook requires the channel handle to find the owner.
function useFetchChannelVideos(channelHandle , refetchTrigger){

    // state to keep channel videos
    const [channelVideos, setChannelVideos] = useState(null);
    
    // We use the channel details hook to get the owner's details first.
    const { channelDetails } = useFetchChannelDetails(channelHandle);

    // useEffect runs when channelDetails becomes available.
    useEffect(() => {
        // Only proceed if channel details have been successfully loaded and an owner ID exists.
        if (!channelDetails || !channelDetails.owner) {
            // Set to empty array if no owner ID is found or details are still loading.
            setChannelVideos([]); 
            return;
        }

        async function fetchVideos(){
            try {
                // IMPORTANT: We will use the existing fetchAllVideos endpoint and rely on 
                // the frontend to filter by the owner's ID for simplicity and speed.
                const API_URL = 'https://youtube-clone-8zd0.onrender.com/api/videos';
                
                const response = await axios.get(API_URL);

                if (response.data && response.data.length > 0) {
                    // Filter the video list to include ONLY videos where uploader ID matches the channel owner ID.
                    const filtered = response.data.filter(video => 
                        video.uploader === channelDetails.owner
                    );
                    setChannelVideos(filtered);
                } else {
                    setChannelVideos([]);
                }
            } catch (error) {
                console.error("Failed to fetch channel videos:", error.message);
                setChannelVideos([]);
            }
        };

        fetchVideos();
    // Re-run whenever the handle changes or the channelDetails object is updated.
    }, [channelDetails , refetchTrigger]); 

    // Return the list of videos.
    return channelVideos;
};

export default useFetchChannelVideos;