import React, {useEffect, useState} from 'react'
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import axiosInstance from "./axiosApi";
import Grid from "@mui/material/Grid"


const FriendRequest = ({request, onResponseCallback, old, oldFriends, onUpdateCallback}) => {
    const [active, setActive] = useState(request.is_active)

    const handleAccept = async (e) => {
        const response = await axiosInstance.post('/friends/request/' + request.username, {
            state: 1
        });
        console.log(response.data)
        setActive(false)
        const response_user = await axiosInstance.get(`/auser/${request.username}`)
        const newRequests = old.map((req) => req.id !== request.id)
        const newFriends = [...oldFriends, response_user.data]
        onUpdateCallback(newFriends)
        console.log(newFriends)
        onResponseCallback(newRequests)
        e.preventDefault()
    }
    const handleDecline = async (e) => {
        const response = await axiosInstance.post('/friends/request/' + request.username, {
            state: 0
        });
        console.log(response.data)
        setActive(true)
        const newRequests = old.map((req) => req.id !== request.id)
        onResponseCallback(newRequests)
        console.log(request)
        e.preventDefault()
    }
    const handleSend = async (e) => {
        const response = await axiosInstance.post('/friends/add-friend/' + request.username, {
            is_active: true

        });
        console.log(response.data)
        e.preventDefault()
    }
    return (
        <>
            <div className={styles.request_card}>
                <p>{request.username}</p>
                <img className={styles.avatar} src={request.profile_picture} alt="requester_profile"/>
                <Grid container spacing={1} direction="column" justify="center" className={styles.button_container}>
                    <Button className={styles.button} variant="contained" onClick={handleAccept}>Accept</Button>
                    <Button className={styles.button} variant="contained" onClick={handleDecline}>Decline</Button>
                </Grid>

            </div>


        </>
    )
}

export default FriendRequest