import React, {useEffect, useState} from 'react'
import Friend from "./Friend";
import axiosInstance from "./axiosApi";

const FriendList = () => {
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

    useEffect (() => {
        console.log("FRIENDS STATE CHANGED: ")
        console.log(friends)

    }, [friends])

    const unFriendCallback = (user) => {
        const updatedFriends = friends.filter((friend) => friend.username !== user.username)
        setFriends(updatedFriends)
    }
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
        friends.map((friend, index) => (
            <Friend
                friend={friend}
            onUnfriendCallback={unFriendCallback}/>
        ))
    )
}
export default FriendList