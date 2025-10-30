// Displays the main video player, comments, and suggested videos.

import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import useFetchVideoDetails from "../hooks/useFetchVideoDetails.js"
// Import icons for interaction buttons.
import { AiOutlineLike, AiOutlineDislike, AiOutlineShareAlt, AiOutlineDownload } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { closeMenu } from '../utils/appSlice'; 

import CommentCard from './CommentCard.jsx';
import AddCommentForm from './AddCommentForm.jsx';
import VideoCard from './VideoCard.jsx'; 
import useFetchVideos from '../hooks/useFetchVideos.js'; 

// Import Redux hook and Axios.
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from "./Sidebar.jsx"; // Ensure sidebar is imported

function VideoPlayerPage() {

    // state to render change
    const [refetchTrigger, setRefetchTrigger] = useState(0);
    // getting video id from url
    const {videoId} = useParams();
    // using custom hook to get video details
    const videoDetails = useFetchVideoDetails(videoId, refetchTrigger);
    // getting all videos from custom hook
    const allVideos = useFetchVideos(); 
    const dispatch = useDispatch();

    // Select states from Redux
    const isMenuOpen = useSelector((store) => store.app.isMenuOpen); 
    // getting token and login status from user slice
    const { token, isLoggedIn } = useSelector((store) => store.user); 

    // by default close sidebar on video page mount (side effect)
    useEffect(() => {
        dispatch(closeMenu());
    }, [dispatch]); 


    // Function called by the AddCommentForm upon successful submission.
    function handleCommentAdded(){
        // this render a change (change in state => component re-render)
        setRefetchTrigger(prev => prev + 1); 
        console.log('Refetch triggered. The comments array will now refresh.');
    };

    // Function called by the forms upon successful action (reused for likes).
    const handleRefetch = () => {
        setRefetchTrigger(prev => prev + 1); 
        console.log('Refetch triggered for counts/comments.');
    };

    // Function to format numbers for display (e.g., 12500 -> 12.5K)
    const formatCount = (count) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count;
    };

    // Function to handle like/dislike clicks
    async function handleLikeClick(type){

    // type -> like or dislike

    if (!isLoggedIn) {
        alert("Please sign in to like or dislike videos.");
        return;
    }

    try {
        await axios.post(
            `http://localhost:8080/api/video/${videoId}/interact`,
            // Payload ({ actionType: type }): The backend needs to know which count to increment.
            // We send the value passed into the function (either 'like' or 'dislike').
            { actionType: type },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        // helper function to display updated count
        handleRefetch();
    } catch (error) {
        console.error(`Failed to post ${type}:`, error.response?.data?.message || error.message);
        alert("Failed to record interaction. Please ensure you are logged in.");
    }
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
    
    // Generate suggested videos list by shuffling and taking a few videos.
    const suggestedVideos = allVideos
        .filter(v => v._id !== videoId) 
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 10); 

    // Once videoDetails is loaded (not null and not false):
    return (
        <div className="mt-14 flex w-full"> 
            {/* Render Sidebar based on Redux state for responsiveness */}
            {isMenuOpen ? <Sidebar /> : null} 
            <div className="p-6 flex justify-center grow"> 
                <div className="grid grid-cols-12 w-full max-w-7xl">
                    {/* Left Column: Video Player and Details (8/12 width on large screens) */}
                    <div className="col-span-12 lg:col-span-8 pr-5">
                        {/* Video Player*/}
                        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                            {/* // using video details we got from custom hook */}
                            {/* using iframe to play videos uploaded on cloud hosting sites */}
                            <iframe 
                                src={videoDetails.videoUrl}
                                title={videoDetails.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        
                        {/* Video Title and Details */}
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
                            
                            {/* Interaction Buttons */}
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

                                {/* Share Button */}
                                <button className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full font-medium transition-colors">
                                    <AiOutlineShareAlt className="text-xl mr-2" />
                                    <span>Share</span>
                                </button>

                                {/* Download Button */}
                                <button className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full font-medium transition-colors">
                                    <AiOutlineDownload className="text-xl mr-2" />
                                    <span>Download</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Description*/}
                        <div className="bg-gray-100 p-3 rounded-lg text-sm mb-4">
                            <p>{videoDetails.description}</p>
                        </div>

                        {/* Comment Section - Reading Existing Comments  */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-bold mb-3">
                                Comments ({videoDetails.comments?.length || 0})
                            </h3>

                            {/* AddCommentForm */}
                            <AddCommentForm 
                                videoId={videoId} 
                                onCommentAdded={handleCommentAdded}
                            />
                            
                            {/* Comment Cards List */}
                            <div className="space-y-4 pt-4">
                                {videoDetails.comments && videoDetails.comments.map((comment, index) => (
                                    <CommentCard 
                                        key={comment.userId + index} 
                                        comment={comment} 
                                        videoId={videoId}           
                                        onDelete={handleCommentAdded} 
                                        onEditSuccess={handleCommentAdded} 
                                    />
                                ))}
                                
                                {videoDetails.comments?.length === 0 && (
                                    <p className="text-sm text-gray-500">Be the first to comment!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Suggested Videos */}
                    <div className="col-span-12 lg:col-span-4 pl-5 border-l">
                        <h3 className="text-xl font-bold mb-4">Suggested Videos</h3>
                        <div className="space-y-4">
                        {/* suggestedVideos array have random videos inside from above function */}
                            {suggestedVideos.map((video) => (
                                // Use VideoCard for suggested videos, passing isChannelView=false
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayerPage;