import React, {useState, useEffect, useMemo} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import FriendRequest from "./FriendRequest";
import Post from "./Post";
import "../../static/css/customStyles.css"
import CreatePost from "./CreatePost";
import useFetchAllPosts from "./useFetchAllPosts";
import {useAuth} from "./AuthContext";


const AllFeed = () => {
    const {posts, setPosts,} = useFetchAllPosts()
    const {likedPosts, setLikedPosts, isLoading} = useLikedPosts()
    const memorizedPosts = useMemo(() => posts, [posts])
    const {loggedUser} = useAuth()
    const handleDeletePost = async () => {
        fetchData();
    };

    const handleLikePost = async () => {
        fetchLikedPosts();
    }

    return (
        <div className="card" style={{width: '48rem', marginLeft: '325px'}}>
            <div className="border border-left border-right px-0">
                <div className="p-3 border-bottom">
                    <h4 className="d-flex align-items-center mb-0">
                        Media <i className="far fa-xs fa-star ms-auto text-primary"></i>
                    </h4>
                </div>
                <div>
                    <CreatePost onCreateCallback={setPosts} old={posts}/>
                    <div>
                        {isLoading ? (
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
                                    onDelete={setPosts}
                                    isLiked={likedPosts.some(liked => liked.id === post.id)}
                                    onLike={setLikedPosts}
                                    oldLikes={likedPosts}
                                    oldPosts={posts}
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

const useLikedPosts = () => {
    const [likedPosts, setLikedPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                const response = await axiosInstance.get('/posts/liked')
                setLikedPosts(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error(error);
            }
        }

        fetchLikedPosts();
    }, []);

    return {likedPosts, setLikedPosts, isLoading};
}

export default AllFeed;