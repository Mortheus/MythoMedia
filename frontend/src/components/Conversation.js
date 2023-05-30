import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import Message from "./Message";

const Conversation = ({chat_id}) => {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        fetchData()
    }, [chat_id])

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/chats/conversation-history/' + chat_id.toString())
            setMessages(response.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            { messages.map((message, index) => (
                <div>
                    <p>{message.sender}</p>
                    <p>{message.body}</p>
                    <p>{message.sent_at}</p>
                </div>
            ))
            }
        </>
    )
}

export default Conversation