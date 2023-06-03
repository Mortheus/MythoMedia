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


const Post = ({post, onDelete, isLiked, onLike}) => {
    const [edited, setEdited] = useState(post)


    const handleLike = async (e) => {
        await axiosInstance.get('/posts/post/' + post.id.toString() + "/1")
        onLike();
        e.preventDefault()

    }

    const handleDislike = async (e) => {
        await axiosInstance.get('/posts/post/' + post.id.toString() + "/0")
        onLike();
        e.preventDefault()

    }

    const handleDelete = async (e) => {
        try {
            await axiosInstance.delete('posts/delete/' + post.id.toString())
            onDelete();
        } catch (error) {
            console.error(error)
        }
    }
    const username = sessionStorage.getItem('username')

    return (
        <>
            <div className={styles.card_profile}>
                <EditPost
                    post={post}
                    onEditCallback={setEdited}/>
                <PostHistory
                    post_id={post.id}/>
                <p>{post.user}</p>
                <p>{post.description}</p>
                <p>{post.tags}</p>
                <p>{post.likes_count}</p>
                {post.image ?
                    <img className={styles.avatar} src={post.image} alt="profile"/>
                    :
                    <></>
                }
                <p>{post.posted_at}</p>
                {!isLiked ? (
                    <Button onClick={handleLike}>
                        <FavoriteIcon/>
                    </Button>
                ) : (
                    <Button onClick={handleDislike}>
                        <FavoriteBorderIcon/>
                    </Button>
                )
                }
                <Button onClick={handleDelete}>
                    <DeleteIcon/>
                </Button>
                <CreateComment
                    post_id={post.id}/>
            </div>

        </>
    )
}

export default Post