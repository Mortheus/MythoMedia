import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";


const Message = ({user, body}) => {
    return(
        <>
            <p>user.username</p>
            <p>user.profile_picture</p>
            <p>body</p>
        </>
    )
}

export default Message