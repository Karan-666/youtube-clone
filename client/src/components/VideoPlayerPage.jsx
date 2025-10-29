// Displays the main video player, comments, and suggested videos.
import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import useFetchVideoDetail from "../hooks/useFetchVideoDetails.js"
// Import icons for interaction buttons.
import { AiOutlineLike, AiOutlineDislike, AiOutlineShareAlt, AiOutlineDownload } from 'react-icons/ai';

import CommentCard from './CommentCard.jsx';
import AddCommentForm from './AddCommentForm.jsx';

// 1. NEW: Import Redux hook and Axios.
import { useSelector } from 'react-redux';
import axios from 'axios';

function VideoPlayerPage() {

    // 2. NEW: State variable used to force the custom hook to re-run.
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    // Extract the 'videoId' from the URL path (e.g., /watch/videoId).
    const {videoId} = useParams();

   // Call the custom hook to fetch the video details using the ID.
    const videoDetails = useFetchVideoDetail(videoId, refetchTrigger);

    // 2. NEW: Retrieve token and login status from Redux.
    const { token, isLoggedIn } = useSelector((store) => store.user);

    // 4. Function called by the AddCommentForm upon successful submission.
    function handleCommentAdded(){
        // Incrementing the state value forces the component (and thus the hook) to re-render and refetch.
        setRefetchTrigger(prev => prev + 1); 
        console.log('Refetch triggered. The comments array will now refresh.');
    };

    // Function called by the forms upon successful action (reused for likes).
    const handleRefetch = () => {
        setRefetchTrigger(prev => prev + 1); 
        console.log('Refetch triggered for counts/comments.');
    };

    
    // Handle Loading State: If data is null, show a loading message.
    if (videoDetails === null) {
        return (
            <div className="mt-14 p-6 text-center">
                <h1 className="text-xl text-gray-600">Loading Video Details...</h1>
            </div>
        );
    }

    // Handle Not Found State: If data is explicitly false (from error handling in hook).
    if (videoDetails === false) {
        return (
            <div className="mt-14 p-6 text-center">
                <h1 className="text-xl text-red-600">Error: Video not found!</h1>
            </div>
        );
    }

    // Function to format numbers for display (e.g., 12500 -> 12.5K)
    const formatCount = (count) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count;
    };

    // 3. UPDATE: Function to handle like/dislike clicks.
    const handleLikeClick = async (type) => {
        // Must be logged in to interact.
        if (!isLoggedIn) {
            alert("Please sign in to like or dislike videos.");
            return;
        }

        try {
            // Send the protected POST request.
            await axios.post(
                // API URL: POST /api/video/:id/interact
                `http://localhost:8080/api/video/${videoId}/interact`,
                // Payload: Send the action type ('like' or 'dislike').
                { actionType: type },
                // Configuration object: Authorization header with JWT token.
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );

            // If successful, force the video details to refresh instantly.
            handleRefetch();

        } catch (error) {
            console.error(`Failed to post ${type}:`, error.response?.data?.message || error.message);
            alert("Failed to record interaction. Please ensure you are logged in.");
        }
    };

    // Once videoDetails is loaded (not null and not false):
    return (
        <div className="mt-14 p-6 flex justify-center">
            <div className="grid grid-cols-12 w-full max-w-7xl">
                
                {/* Left Column: Video Player and Details */}
                <div className="col-span-12 lg:col-span-8 pr-5">
                    
                    {/* Video Player (UNCHANGED) */}
                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        <iframe 
                            src={videoDetails.videoUrl}
                            title={videoDetails.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                    
                    {/* Video Title and Details (UNCHANGED) */}
                    <h2 className="text-xl font-bold mb-1">{videoDetails.title}</h2>
                    
                    {/* Channel Info and Interaction Buttons */}
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        {/* Channel/Views Info */}
                        <p className="text-base font-semibold">
                            Channel: {videoDetails.channelId}
                            <span className="text-sm font-normal text-gray-600 ml-4">
                                {formatCount(videoDetails.views)} views
                            </span>
                        </p>
                        
                        {/* 2. NEW: Interaction Buttons */}
                        <div className="flex space-x-3 text-sm text-gray-700">
                            
                            {/* Like Button */}
                            <button 
                                onClick={() => handleLikeClick('like')}
                                className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full font-medium transition-colors"
                            >
                                <AiOutlineLike className="text-xl mr-2" />
                                <span>{formatCount(videoDetails.likes)}</span>
                            </button>

                            {/* Dislike Button */}
                            <button 
                                onClick={() => handleLikeClick('dislike')}
                                className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full font-medium transition-colors"
                            >
                                <AiOutlineDislike className="text-xl mr-2" />
                                <span>{formatCount(videoDetails.dislikes)}</span>
                            </button>

                            {/* Share Button (Placeholder) */}
                            <button className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full font-medium transition-colors">
                                <AiOutlineShareAlt className="text-xl mr-2" />
                                <span>Share</span>
                            </button>

                            {/* Download Button (Placeholder) */}
                            <button className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full font-medium transition-colors">
                                <AiOutlineDownload className="text-xl mr-2" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Description (UNCHANGED) */}
                    <div className="bg-gray-100 p-3 rounded-lg text-sm mb-4">
                        <p>{videoDetails.description}</p>
                    </div>

                    {/* Comment Section - Reading Existing Comments */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-bold mb-3">
                            Comments ({videoDetails.comments?.length || 0})
                        </h3>

                        {/* 3. NEW: Place the form component here, passing the video ID. */}
                        {/* The onCommentAdded prop will be used later to trigger a refetch. */}
                        {/* 5. Pass the handleCommentAdded function to the form component. */}
                        <AddCommentForm 
                            videoId={videoId} 
                            onCommentAdded={handleCommentAdded} // NEW: The form calls this function on success.
                        />
                        
                        <div className="space-y-4 pt-4">
                            {/* 3. Map over the comments array embedded in the video document. */}
                            {videoDetails.comments && videoDetails.comments.map((comment, index) => (
                                // Use a combination of user ID and index as a unique key for list rendering.
                                <CommentCard 
                                    key={comment.userId + index} 
                                    comment={comment} 
                                    videoId={videoId}           // 1. NEW: Pass the video ID to the CommentCard.
                                    onDelete={handleCommentAdded} // 2. NEW: Pass the refetch trigger for deletion.
                                    onEditSuccess={handleCommentAdded} // Passed for Edit refresh
                                />
                            ))}
                            
                            {videoDetails.comments?.length === 0 && (
                                <p className="text-sm text-gray-500">Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Suggested Videos (UNCHANGED) */}
                <div className="col-span-12 lg:col-span-4 pl-5 border-l">
                    <h3 className="text-xl font-bold mb-4">Suggested Videos</h3>
                    <div className="space-y-4">
                        <p className="text-gray-500">Suggested Video Card 1</p>
                        <p className="text-gray-500">Suggested Video Card 2</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayerPage;