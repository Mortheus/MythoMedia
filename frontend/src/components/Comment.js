import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';

const username = sessionStorage.getItem('username')

function convertTime(date) {
    const now = new Date(); // Current date/time
    const datetime = new Date(date);

    const timeDifference = now.getTime() - datetime.getTime(); // Difference in milliseconds

    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)); // Difference in hours
    const daysDifference = Math.floor(hoursDifference / 24); // Difference in days

    let timeAgo;
    if (daysDifference > 0) {
        timeAgo = daysDifference + 'd';
    } else {
        timeAgo = hoursDifference + 'h';
    }
    return timeAgo;
}

const Comment = ({user, text, likes_count, timestamp, id, onDelete}) => {
    const [selected, setSelected] = useState()
    const [likedComms, setLikedComms] = useState([])
    useEffect(() => {
        fetchComments();
    }, [])
    useEffect(() => {
        if (selected) {
            fetchComments();
        }
    }, [selected])


    const handleDeleteComment = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.delete('/comments/delete/' + id.toString())
            onDelete();
        } catch (error) {
            console.error(error)
        }
    }

    const fetchComments = async () => {
        try {
            const response = await axiosInstance.get('/comments/liked_comments')
            setLikedComms(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleLikeComment = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put('comments/like/' + id.toString())
            setSelected(id)
        } catch (error) {
            console.error(error)
        }
    }
    const handleDisLikeComment = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put('comments/unlike/' + id.toString())
            setSelected(id)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div>
                <p>{user}</p>
                <p>{text}</p>
                <p>{likes_count}</p>
                <p>{convertTime(timestamp)}</p>
                {!likedComms.some((obj) => obj.id === id) ? (
                    <Button onClick={handleLikeComment}><FavoriteBorderIcon/></Button>
                ) : (
                    <Button onClick={handleDisLikeComment}><FavoriteIcon/></Button>
                )}
                {username === user && <Button onClick={handleDeleteComment}><DeleteIcon/></Button>}
            </div>
        </>
    )

}

export default Comment