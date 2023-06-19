import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";

const useFetchPost = (id) => {
    const [post, setPost] = useState()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(`/posts/details/${id}`);
                setPost(response.data);
                console.log(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchPost();
    }, []);

    return {post, setPost, isLoading};
}

export default useFetchPost;