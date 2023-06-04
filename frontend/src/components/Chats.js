import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Conversation from "./Conversation"


const Chats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    useEffect(async () => {
        fetchData()
    }, [])

    useEffect(() => {
        console.log("CHAT STATE CHANGED")
        console.log(selectedChat)
    }, [selectedChat])

    const handleClickChat = (chat) => {
        console.log("INSIDE handleClickChat")
        console.log(chat)
        setSelectedChat(chat)

    }
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/chats/')
            setChats(response.data)
        } catch (error) {
            console.error(error)
        }

    }
    return (
        <>
            <div className={styles.conversationContainer}>
                <div className={styles.chatList}>
                    {chats ? (
                        chats.map((chat, index) => (
                            <div
                                key={chat.id}
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
                </div>
                {selectedChat ? (
                    <div className={styles.conversation}>
                        <div
                            key={selectedChat.id}
                            // onClick={() => handleClickChat(chat)}
                            className={styles.card_profile}>
                            <p>{selectedChat.name}</p>
                            <p>{selectedChat.description}</p>
                            <img src={selectedChat.image} className={styles.avatar} alt="group_image"/>
                        </div>
                        <Conversation
                            chat_id={selectedChat.id}/>
                    </div>
                ) : (
                    <p>Select a chat!</p>
                )}
            </div>
        </>
    )
}

export default Chats