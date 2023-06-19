import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import CreateComment from "./CreateComment";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPost from "./EditPost";
import {Edit} from "@mui/icons-material";
import PostHistory from "./PostHistory";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthContext";


const Post = ({post, onDelete, isLiked, onLike, oldLikes, oldPosts}) => {
    const [edited, setEdited] = useState(post)
    const navigate = useNavigate()
    const {loggedUser} = useAuth()

    const handleLike = async (e) => {
        const response = await axiosInstance.get('/posts/post/' + post.id.toString() + "/1")
        const update_likes = [...oldLikes, response.data.id]
        onLike(update_likes);
        console.log(update_likes)
        e.preventDefault()

    }

    const handleDislike = async (e) => {
        const response = await axiosInstance.get('/posts/post/' + post.id.toString() + "/0")
        const update_likes = oldLikes.filter((post) => post !== response.data.id)
        console.log(update_likes)
        onLike(update_likes);
        e.preventDefault()

    }

    const handleDelete = async (e) => {
        try {
            await axiosInstance.delete('posts/delete/' + post.id.toString())
            const updatedPosts = oldPosts.filter((updatedPost) => updatedPost.id !== post.id )
            console.log(updatedPosts)
            onDelete(updatedPosts);
        } catch (error) {
            console.error(error)
        }
    }


    if (!loggedUser) {
        return null
    }
    return (
        <>
            <div className="d-flex p-3 border-bottom">
                <div
                    onClick={() => navigate(`/profile/${post.user}`)}>
                    <img src={post.user_profile_picture}
                         className="rounded-circle"
                         height="50" alt="Avatar" loading="lazy"/>
                </div>
                <div className="d-flex w-100 ps-3">
                    <div>
                        <div>
                            <h6 className="text-body">
                                {post.user}
                                <span className="small text-muted font-weight-normal"> • </span>
                                <span
                                    className="small text-muted font-weight-normal">{post.posted_at}</span>
                                <PostHistory post_id={post.id}/>
                            </h6>
                        </div>
                        <p style={{lineHeight: '1.2'}}>
                            {post.description}
                        </p>
                        {post.image && (
                            <div>
                                <img src={post.image}
                                     className="img-fluid rounded mb-3" alt="Fissure in Sandstone"
                                />
                            </div>

                        )}
                        <ul className="list-unstyled d-flex justify-content-between mb-0 pe-xl-5">
                            <li>
                                <i className="far fa-comment" onClick={() => navigate(`/post/${post.id}`)}></i>
                            </li>
                            <li>
                                {isLiked ? (
                                    <Button onClick={handleDislike}><FavoriteIcon/></Button>
                                ) : (
                                    <Button onClick={handleLike}><FavoriteBorderIcon/></Button>
                                )}<span
                                className="small ps-2">{post.likes_count}</span>
                            </li>
                            <li>
                                {post.user === loggedUser.username && <Button onClick={handleDelete}><DeleteIcon/></Button>}
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Post


