import { useEffect, useState } from "react";
import axios from "axios";

function useFetchVideos(){

    const [videoData, setVideoData] = useState([]);

    const API = "http://localhost:8080/api/videos";

    useEffect(
        ()=>{

        async function useApi(){
            try{
                const res = await axios.get(API);
                // Check for successful data and update the state.
                if (res.data && res.data.length > 0) {
                    setVideoData(res.data);
                }
            } catch(error){
                // Log the error if the API call fails (e.g., server is down, 404 response).
                console.error("Failed to fetch videos from backend:", error.response?.data?.message || error.message);
            }
        }

        useApi();

        } , [] // dependency array empty -> run once
    )
    return videoData;
}

export default useFetchVideos;