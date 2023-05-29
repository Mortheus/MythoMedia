import React, {useEffect, useState} from 'react'
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import axiosInstance from "./axiosApi";
import Grid from "@mui/material/Grid"


const FriendRequest = ({is_active, username, profile_picture}) => {
    const [active, setActive] = useState(is_active)

    // useEffect(() => {
    //     console.log('is_active changed:', active);
    // }, [active])
    const handleAccept = async (e) => {
        const response = await axiosInstance.post('/friends/request/' + username, {
            state: 1
        });
        console.log(response.data)
        setActive(false)
        e.preventDefault()
    }
    const handleDecline = async (e) => {
        const response = await axiosInstance.post('/friends/request/' + username, {
            state: 0
        });
        console.log(response.data)
        setActive(true)
        e.preventDefault()
    }
    const handleSend = async (e) => {
        const response = await axiosInstance.post('/friends/add-friend/' + username, {
            is_active: true

        });
        console.log(response.data)
        e.preventDefault()
    }
    // if (!active) {
    //     return null;
    // }

    return (
        <>
            <div className={styles.request_card}>
                <p>{username}</p>
                <img className={styles.avatar} src={profile_picture} alt="requester_profile"/>
                <Grid container spacing={1} direction="column" justify="center" className={styles.button_container}>
                    <Button className={styles.button} variant="contained" onClick={handleAccept}>Accept</Button>
                    <Button className={styles.button} variant="contained" onClick={handleDecline}>Decline</Button>
                </Grid>

            </div>


        </>
    )
}

export default FriendRequest