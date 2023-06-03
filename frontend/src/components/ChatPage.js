import axiosInstance from "./axiosApi";
import React, {useEffect} from 'react'
import {useState} from 'react'
import CreateGroup from "./CreateGroup";
import Conversation from "./Conversation";
import ViewGroupDetails from "./ViewGroupDetails";
import Message from "./Message";
import EditGroup from "./EditGroup";
import Chats from "./Chats";

const ChatPage = () => {
    return (
        <>
            <div>
                {/*<CreateGroup></CreateGroup>*/}
                <Chats></Chats>
            </div>
            {/*<Conversation></Conversation> //chat ID => this should cover almost 3/4 of the page, and should show when one of the chats is clicked*/}
            {/*<ViewGroupDetails></ViewGroupDetails> //group ID => this should show when click on the header of the current conversation*/}
            {/*<Message></Message> => this should be in every conversation (history)*/}
            {/*<EditGroup></EditGroup> //group_ID, members, handleDeleteCallback => this should be for every chat in chats*/}
        </>
    )
}

export default ChatPage
