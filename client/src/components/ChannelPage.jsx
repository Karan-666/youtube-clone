// ChannelPage.jsx -> the channel main page

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import useFetchChannelDetails from "../hooks/useFetchChannelDetails.js";
import useFetchChannelVideos from "../hooks/useFetchChannelVideos.js";
import VideoCard from "./VideoCard.jsx";
import VideoManagementModal from "./VideoManagementModal.jsx";
import { useState } from "react";

function ChannelPage() {
  // desconstructing to get channel handle name
  const { handle } = useParams();

  // State to manage video refetching (for CRUD operations).
  // The Synchronization Signal.
  // This number is incremented after a successful Upload, Edit, or Delete operation.
  // This forces the useFetchChannelVideos hook to re-run and update the video list instantly.
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // State for modal control.
  // Controls the visibility of the VideoManagementModal (the upload/edit pop-up)
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);

  // Call hooks, passing the trigger to the video hook dependency.
  // using custom hook made to fetch channel details
  const { channelDetails, isOwner } = useFetchChannelDetails(handle);
  const channelVideos = useFetchChannelVideos(handle, refetchTrigger);

  // Helper function to force video list refresh.
  // (prev) => prev + 1: This is the functional update form of useState.
  // It takes the old value (prev) of the state (which is a number, starting at 0) and increases it by 1.
  // Result: The component instantly sees that a state variable has changed, which triggers a re-render of the entire component.
  function handleRefetch() {
    setRefetchTrigger((prev) => prev + 1);
  }

  // Function to handle Edit click from a VideoCard.
  function handleEditVideo(videoData) {
    setVideoToEdit(videoData);
    setIsEditMode(true);
    setShowModal(true);
  }

  // Helper function to format large numbers (e.g., 5200 subscribers -> 5.2K)
  const formatSubscribers = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M subscribers";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K subscribers";
    return count + " subscribers";
  };

  // --- Loading and Not Found States ---
  if (channelDetails === null || channelVideos === null) {
    return (
      <div className="mt-14 p-6 text-center">
        <h1 className="text-xl text-gray-600">Loading Channel Details...</h1>
      </div>
    );
  }
  if (channelDetails === false) {
    return (
      <div className="mt-14 p-6 text-center">
        <h1 className="text-2xl text-red-600">
          Error: Channel @{handle} not found!
        </h1>
      </div>
    );
  }

  // Once data is loaded:
  return (
    <div className="mt-14 p-6 flex flex-col items-center">
      {/* Channel Banner */}
      <div className="w-full max-w-7xl h-48 rounded-xl overflow-hidden mb-4 bg-gray-300">
        <img
          src={
            "https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I"
          }
          alt={`${channelDetails.channelName} banner`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info Header */}
      <div className="w-full max-w-7xl flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-6xl text-red-600 flex-shrink-0" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {channelDetails.channelName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {channelDetails.handle} •{" "}
              {formatSubscribers(channelDetails.subscribers)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {/* Checks if its owner, then show upload button else Subscribe button */}
        {isOwner ? (
          <button
            onClick={() => {
              setIsEditMode(false);
              setVideoToEdit(null);
              setShowModal(true);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            Upload Video
          </button>
        ) : (
          <button className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-colors">
            Subscribe
          </button>
        )}
      </div>

      {/* Video Management Section */}
      <div className="w-full max-w-7xl">
        <h3 className="text-xl font-bold mb-4">
          Videos ({channelVideos ? channelVideos.length : 0})
        </h3>

        {channelVideos.length === 0 ? (
          <p className="text-gray-500">
            {isOwner
              ? "You haven't uploaded any videos yet."
              : "This channel has no videos."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channelVideos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                isChannelView={true}
                isOwner={isOwner}
                onEdit={handleEditVideo}
                onRefetch={handleRefetch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Render the Video Management Modal */}
      <VideoManagementModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        isEditMode={isEditMode}
        initialVideoData={videoToEdit}
        onVideoSaved={handleRefetch} // Refetch videos after upload/edit
      />
    </div>
  );
}

export default ChannelPage;
