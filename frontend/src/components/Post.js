import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import CreateComment from "./CreateComment";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';


const Post = ({user, description, tags, likes_count, image, posted_at, id, onDelete, isLiked, onLike}) => {


    const handleLike = async (e) => {
        await axiosInstance.get('/posts/post/' + id.toString() + "/1")
        onLike();
        e.preventDefault()

    }

    const handleDislike = async (e) => {
        await axiosInstance.get('/posts/post/' + id.toString() + "/0")
        onLike();
        e.preventDefault()

    }

    const handleDelete = async (e) => {
        try {
            await axiosInstance.delete('posts/delete/' + id.toString())
            onDelete();
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className={styles.card_profile}>
                <p>{user}</p>
                <p>{description}</p>
                <p>{tags}</p>
                <p>{likes_count}</p>
                {image ?
                    <img className={styles.avatar} src={image} alt="profile"/>
                    :
                    <></>
                }
                <p>{posted_at}</p>
                {!isLiked ? (
                    <Button  onClick={handleLike}>
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
                    post_id={id}/>
            </div>

        </>
    )
}

export default Post