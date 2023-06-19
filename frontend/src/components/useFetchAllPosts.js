import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";

const useFetchAllPosts = (id) => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axiosInstance.get(`/posts/feed`);
                const sortedPosts = response.data.sort((a,b) => b.id - a.id);
                setPosts(sortedPosts);
                console.log(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching posts: ', error);
            }
        };

        fetchPost();
    }, []);

    return {posts, setPosts, isLoading};
}

export default useFetchAllPosts;