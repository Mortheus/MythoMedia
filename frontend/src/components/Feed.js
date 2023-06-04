import React, {useState, useEffect, useMemo} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import FriendRequest from "./FriendRequest";
import Post from "./Post";

const Feed = ({username}) => {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const memorizedPosts = useMemo(() => posts, [posts])


    useEffect(() => {
        if (username) {
            fetchData();
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            fetchLikedPosts();
        }
    }, [username]);
    const handleDeletePost = async () => {
        fetchData();
    };

    const handleLikePost = async () => {
        fetchLikedPosts();
    }

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/posts/user/' + username);
            setPosts(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLikedPosts = async () => {
        try {
            const response = await axiosInstance.get('/posts/liked')
            setLikedPosts(response.data.map(likedpost => likedpost.id))
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {username ? (
                memorizedPosts.map((post, index) => (
                    <Post
                        post={post}
                        onDelete={handleDeletePost}
                        isLiked={likedPosts.includes(post.id)}
                        onLike={handleLikePost}/>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default Feed;