// ChannelPage.jsx - Displays channel information and allows the owner to manage videos.

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// We will need these to check if the user is the owner later
import { useSelector } from 'react-redux'; 
import { FaUserCircle } from 'react-icons/fa';

// 1. NEW: Import the custom hook to fetch channel details.
import useFetchChannelDetails from '../hooks/useFetchChannelDetails.js';

function ChannelPage() {
    // 1. Get the channel handle from the URL (we will set up the route next).
    const { handle } = useParams();
    
    // 3. Call the custom hook to fetch the channel details.
    const channelDetails = useFetchChannelDetails(handle);
    
    // Placeholder for checking if the logged-in user owns this page (will be implemented next)
    const isChannelOwner = false; 

    // Helper function to format large numbers (e.g., 5200 subscribers -> 5.2K)
    const formatSubscribers = (count) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M subscribers';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K subscribers';
        return count + ' subscribers';
    };

    // 4. Handle Loading State: If data is null, show a loading message.
    if (channelDetails === null) {
        return (
            <div className="mt-14 p-6 text-center">
                <h1 className="text-xl text-gray-600">Loading Channel Details...</h1>
            </div>
        );
    }

    // 5. Handle Not Found State: If data is explicitly false (from error handling in hook).
    if (channelDetails === false) {
        return (
            <div className="mt-14 p-6 text-center">
                <h1 className="text-2xl text-red-600">Error: Channel @{handle} not found!</h1>
            </div>
        );
    }

   // Once channelDetails is loaded:
    return (
        <div className="mt-14 p-6 flex flex-col items-center">
            
            {/* 6. Channel Banner (using actual URL from data) */}
            <div className="w-full max-w-7xl h-48 rounded-xl overflow-hidden mb-4 bg-gray-300">
                <img 
                    src={channelDetails.channelBanner} // Use the fetched banner URL
                    alt={`${channelDetails.channelName} banner`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 7. Channel Info Header (Name, Subs, Buttons) */}
            <div className="w-full max-w-7xl flex justify-between items-center border-b pb-4 mb-6">
                <div className="flex items-center space-x-4">
                    {/* Channel Avatar/Icon (Placeholder) */}
                    <FaUserCircle className="text-6xl text-red-600 flex-shrink-0" />
                    
                    {/* Name and Subscribers (Display fetched data) */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">{channelDetails.channelName}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            @{channelDetails.handle} • {formatSubscribers(channelDetails.subscribers)}
                        </p>
                    </div>
                </div>
                
                {/* 8. Action Buttons (Upload/Edit/Subscribe) */}
                {isChannelOwner ? (
                    <button className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors">
                        Upload Video
                    </button>
                ) : (
                    <button className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors">
                        Subscribe
                    </button>
                )}
            </div>
            
            {/* 9. Video Management Tabs (Placeholder) */}
            <div className="w-full max-w-7xl">
                <h3 className="text-xl font-bold mb-4">Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <p className="text-gray-500">{channelDetails.description}</p>
                    <p className="text-gray-500">Channel Videos Grid Placeholder</p>
                </div>
            </div>

        </div>
    );
}

export default ChannelPage;