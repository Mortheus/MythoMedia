import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import Message from "./Message";
import Scroll from "./Scroll";

const Conversation = ({chat_id}) => {
    const [messages, setMessages] = useState([]);
    const [body, setBody] = useState("")
    const fetchData = async () => {
        try {
            return await axiosInstance.get('/chats/conversation-history/' + chat_id.toString());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchChatData = async () => {
            const response = await fetchData();
            setMessages(response.data);
        };

        fetchChatData();
    }, [chat_id]);

    useEffect(() => {
        console.log('state changed')
        console.log(messages)
        fetchData()
    }, [messages])


    const handleSend = async () => {
        try {
            const response = await axiosInstance.post('chats/add-message/' + chat_id.toString(), {
                'body': body
            })
            setMessages([...messages, response.data])
            setBody("")
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div className={styles.conversation}>
                <Scroll>
                    {messages.map((message, index) => (
                        <Message message={message}/>
                    ))
                    }
                </Scroll>
                <div className={styles.inputContainer}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label=""
                        value={body}
                        fullWidth
                        variant="standard"
                        onChange={(e) => setBody(e.target.value)}/>
                    <Button onClick={handleSend}><SendIcon/></Button>
                </div>
            </div>
        </>
    )
}

export default Conversation