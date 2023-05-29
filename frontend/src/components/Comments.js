import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import {Comment} from "@mui/icons-material";
import Comment from "./Comment"


const Comments = ({post_id}) => {
    const [comments, setComments] = useState([]);
    useEffect(async () => {
        if (post_id) {
            await fetchData();
        }
    }, [post_id]);
    const handleDeleteComment = async () => {
        fetchData();
    }
    const handleInteractComment = async () => {
        console.log("")

    }
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("comments/all_comments/" + post_id.toString())
            setComments(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {post_id ? (
                comments.map((comment, index) => (
                    <Comment
                        user={comment.user}
                        text={comment.text}
                        likes_count={comment.likes_count}
                        timestamp={comment.timestamp}
                        id={comment.id}
                        onDelete={handleDeleteComment}/>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};
export default Comments;