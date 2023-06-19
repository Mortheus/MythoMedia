import React, {useState, useEffect, useMemo} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import FriendRequest from "./FriendRequest";
import Post from "./Post";
import "../../static/css/customStyles.css"
import CreatePost from "./CreatePost";


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
        <div className="card" style={{width: '48rem'}}>
            <div className="border border-left border-right px-0">
                <div className="p-3 border-bottom">
                    <h4 className="d-flex align-items-center mb-0">
                        Media <i className="far fa-xs fa-star ms-auto text-primary"></i>
                    </h4>
                </div>
                <div>
                    {username === sessionStorage.getItem('username') && <CreatePost/>}
                    <div>
                        {!username ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : !Array.isArray(posts) ? (
                            <p>No posts yet</p>
                        ) : posts.length > 0 ? (
                            posts.map((post, index) => (
                                <Post
                                    post={post}
                                    onDelete={handleDeletePost}
                                    isLiked={likedPosts.includes(post.id)}
                                    onLike={handleLikePost}
                                />

                            ))
                        ) : (
                            <p>No posts yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Feed;