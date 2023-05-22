import React, {useState} from 'react'
import FriendList from './FriendList'
import axiosInstance from "./axiosApi";
import {useEffect} from "react";

const FriendsPage = () => {
    const [friends, setFriends] = useState([])
    useEffect(async () => {
        const fetchData = async () => {
            try {
                const user_ID = sessionStorage.getItem('user_id');
                const data = await getFriends(user_ID);
                console.log()

            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const getFriends = async (user_ID) => {
        try {
            const response = await axiosInstance.get('/friends/friends/' + user_ID.toString());
            setFriends(response.data)
            console.log(response.data)

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <FriendList
                friends={friends}/>
        </>
    )
}

export default FriendsPage