import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import "../../static/css/customStyles.css"
import {useAuth} from "./AuthContext";




const Message = ({message}) => {
    const {loggedUser} = useAuth()
    if (!loggedUser) {
        return null
    }
    return (
        <>
            {message.sender === loggedUser.username ? (
                <div className="d-flex flex-row justify-content-start">
                    <img className="avatar"
                        src={message.profile_picture}
                        alt="avatar"
                        style={{width: "45px", height: "100%"}}
                    />
                    <div>
                        <p
                            className="small p-2 ms-3 mb-1 rounded-3"
                            style={{backgroundColor: "#f5f6f7"}}
                        >
                            {message.body}
                        </p>
                        <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                            {message.sent_at}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-row justify-content-end">
                    <img className="avatar"
                        src={message.profile_picture}
                        alt="avatar"
                        style={{width: "45px", height: "100%", borderRadius: '50%'}}
                    />
                    <div>
                        <p
                            className="small p-2 ms-3 mb-1 rounded-3 bg-primary"
                            style={{backgroundColor: "#f5f6f7"}}
                        >
                            {message.body}
                        </p>
                        <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                            {message.sent_at}
                        </p>
                    </div>
                </div>
            )}

        </>
    )
}

export default Message