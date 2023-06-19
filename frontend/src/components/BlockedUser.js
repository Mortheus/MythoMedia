import React, {useState} from 'react'
import styles from "../../static/css/component.module.css";
import axiosInstance from "./axiosApi";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Button from "@mui/material/Button";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import "../../static/css/customStyles.css"


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
            <div>
                <p>{blockedUser.username}</p>
                <img className="avatar"
                     src={blockedUser.profile_picture}
                     alt="avatar 3"
                     style={{width: "40px", height: "100%", borderRadius: '50%'}}
                />
                <Button onClick={unblockUser}><RemoveCircleOutlineIcon/></Button>


            </div>
        </>
    )
}

export default BlockedUser