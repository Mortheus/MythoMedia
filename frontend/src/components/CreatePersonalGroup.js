import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import DialogMessage from "./DialogMessage";

const CreatePersonalGroup = ({username}) => {
    const [isSent, setIsSent] = useState(false)
    const navigate = useNavigate()
    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post('/chats/create-personal/' + username)
            if (response.data.exists === true || response.status === 201) {
                navigate("/chats")
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleCreate} encType="multipart/form-data">
                <Button type="submit" className={styles.button} variant="contained">
                    Send Message
                </Button>

            </form>
        </div>
    )

}

export default CreatePersonalGroup