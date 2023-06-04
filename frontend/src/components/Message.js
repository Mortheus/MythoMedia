import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";


const Message = ({message}) => {
    const logged_user = sessionStorage.getItem('username')
    console.log(message.sender === logged_user)
    return (
        <>
            <div className={`${styles.container_message} ${message.sender === logged_user ? styles.darker : ''}`}>
            {/*<div className={`${styles.container_message} ${styles.img_right}`}>*/}
                <p>{message.sender}</p>
                <img className={`${styles.avatar} ${styles.small} ${message.sender === logged_user ? styles.img_right : ''}`} src={message.profile_picture} alt="picture"/>
                <p>{message.body}</p>
                <span className={styles.timeRight}>{message.sent_at}</span>
            </div>
        </>
    )
}

export default Message