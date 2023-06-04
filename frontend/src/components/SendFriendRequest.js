import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const SendFriendRequest = ({username}) => {
    const addFriend = async () => {
        try {
            await axiosInstance.post('/friends/add-friend/' + username)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <Button onClick={addFriend}><PersonAddIcon/></Button></>
    )
}

export default SendFriendRequest