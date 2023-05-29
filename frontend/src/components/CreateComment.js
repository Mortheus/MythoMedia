import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ReplyIcon from '@mui/icons-material/Reply';

const CreateComment = ({post_id}) => {
    const [comment_body, setCommentBody] = useState('');

    const handleComment = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('text', comment_body);
        try {
            await axiosInstance.post('/comments/' + post_id.toString(), formData)
            setCommentBody('')
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <form onSubmit={handleComment}>
                <TextField
                    id="comment"
                    label="text"
                    required
                    value={comment_body}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Write a comment here..."/>

                <Button type="submit">
                    <ReplyIcon/>
                </Button>
            </form>
        </>
    )
}

export default CreateComment