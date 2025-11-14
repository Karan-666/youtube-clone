// VideoManagementModal.jsx - Handles creationand updating of videos.

import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import axios from 'axios';

// Modal component accepts props defining its mode, visibility, and initial data for editing.
function VideoManagementModal({ isVisible, onClose, isEditMode, initialVideoData, onVideoSaved }) {
    
    // Local state for form inputs.
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);
    
    // Get token and userId from Redux for authorization.
    const { token, userId } = useSelector((store) => store.user);

    // Effect to pre-fill the form if in Edit Mode.
    useEffect(() => {
        if (isEditMode && initialVideoData) {
            setTitle(initialVideoData.title || '');
            setDescription(initialVideoData.description || '');
            setVideoUrl(initialVideoData.videoUrl || '');
            setThumbnailUrl(initialVideoData.thumbnailUrl || '');
            setCategory(initialVideoData.category || 'General');
        } else {
            // Reset form for Upload mode.
            setTitle('');
            setDescription('');
            setVideoUrl('');
            setThumbnailUrl('');
            setCategory('General');
        }
    }, [isEditMode, initialVideoData]); // Reruns when mode or data changes.

    // function to handle submit button after adding videos
    // for both uplaod and edit of videos
    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);

        // Determine API endpoint and HTTP Method.
        const videoId = initialVideoData?._id; // Get ID for the URL
        const URL = isEditMode 
            ? `https://youtube-clone-8zd0.onrender.com/api/video/${videoId}/edit` // Use the new POST route path (Patch had cors issues with me)
            : 'https://youtube-clone-8zd0.onrender.com/api/video'; // POST (Upload)

        // The method is always 'post' for both Upload and Edit now.
        const method = 'post'; 
        
        // Prepare payload 
        const payload = {
            title: title.trim(),
            description: description.trim(),
            videoUrl: videoUrl.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            category,
            // Only required for POST/Upload: we set a placeholder channel ID.
            // this is done to include channel id only in case of upload and not edit
            ...(method === 'post' && { channelId: 'channel01' }) 
        };

       try {
            // Send the authorized request using the 'post' method.
            const response = await axios.post(URL, payload, { // Use axios.post regardless of mode
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 201 || response.status === 200) {
                alert(`Video successfully ${isEditMode ? 'updated' : 'uploaded'}!`);
                onVideoSaved(); // Trigger parent component refetch.
                onClose();      // Close the modal.
            }
        } catch (error) {
            console.error("Video save error:", error.response?.data);
            alert(`Failed to save video: ${error.response?.data?.message || 'Check inputs/server'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    // --- JSX Structure ---
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold">
                        {isEditMode ? 'Edit Video Details' : 'Upload New Video'}
                    </h2>
                    <IoClose onClick={onClose} className="text-2xl cursor-pointer text-gray-500 hover:text-gray-900" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <input type="text" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded" required />
                    
                    {/* Description */}
                    <textarea placeholder="Video Description" value={description} onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded" rows="3" required />
                    
                    {/* Video URL */}
                    <input type="url" placeholder="Video URL (e.g., https://example.com/vid.mp4)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full p-2 border rounded" required />
                    
                    {/* Thumbnail URL */}
                    <input type="url" placeholder="Thumbnail URL (e.g., https://example.com/thumb.jpg)" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="w-full p-2 border rounded" required />
                    
                    {/* Category Selector */}
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
                        <option value="General">General</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Music">Music</option>
                    </select>

                    <button type="submit" disabled={loading}
                        className="w-full py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 disabled:bg-red-400"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Upload Video')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VideoManagementModal;