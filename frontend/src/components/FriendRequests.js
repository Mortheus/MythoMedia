import React, {useEffect, useState} from 'react'
import styles from "../../static/css/component.module.css";
import FriendRequest from "./FriendRequest";
import axiosInstance from "./axiosApi";

const FriendRequests = () => {
    const [requests, setRequests] = useState([])
    useEffect( async() => {
        const fetchData = async () => {
            try {
                const user_ID = sessionStorage.getItem('user_id')
                const data = await getRequests();
            } catch(error) {
                console.error(error)
            }

        };
        fetchData();
    }, [])

    const getRequests = async () => {
    try {
        const response = await axiosInstance.get('/friends/requests');
        setRequests(response.data)
        console.log(response.data)
    } catch (error) {
        console.error(error)
    }
}
    return (
            requests.map((request, index) => (
                <FriendRequest
                    is_active = {request.is_active}
                    username={request.username}
                    profile_picture={request.profile_picture}/>
            ))
    )
}

export default FriendRequests