import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Conversation from "./Conversation"


const Chats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    useEffect(async() => {
        fetchData()
    }, [])

    const handleClickChat = (chat) => {
        setSelectedChat(chat)

    }
     const fetchData = async() => {
        try {
            const response = await axiosInstance.get('/chats/')
            setChats(response.data)
        } catch(error) {
            console.error(error)
        }

        }
    return (
        <>
            { chats ? (
                chats.map((chat, index) => (
                    <div
                    key={index}
                    onClick={() => handleClickChat(chat)}
                        className={styles.card_profile}>
                        <p>{chat.name}</p>
                        <p>{chat.description}</p>
                        <img src={chat.image} className={styles.avatar} alt="group_image"/>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
            {selectedChat ?  <Conversation
                chat_id={selectedChat.id} /> : <p>Select a chat!</p>}
        </>
    )
}

export default Chats