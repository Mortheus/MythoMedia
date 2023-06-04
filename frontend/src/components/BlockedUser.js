import React, {useState} from 'react'
import styles from "../../static/css/component.module.css";
import axiosInstance from "./axiosApi";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Button from "@mui/material/Button";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const BlockedUser = ({blockedUser, onRemoveCallback}) => {
    const unblockUser = async () => {
        try {
            const response = await axiosInstance.post('/friends/unblock_user/' + blockedUser.username)
            onRemoveCallback(blockedUser)
            return (
                <Alert
                    iconMapping={{
                        success: <CheckCircleOutlineIcon fontSize="inherit"/>,
                    }}
                >
                    {response.data.msg}
                </Alert>
            )
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <p>{blockedUser.username}</p>
            <img className={styles.avatar} src={blockedUser.profile_picture} alt="friend_profile"/>
            <Button onClick={unblockUser}><RemoveCircleOutlineIcon/></Button>

        </>
    )
}

export default BlockedUser