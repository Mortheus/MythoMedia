import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";

const useFetchComments = (id) => {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/comments/all_comments/${id}`);
        setComments(response.data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

    return {comments, setComments ,isLoading};
}

export default useFetchComments;