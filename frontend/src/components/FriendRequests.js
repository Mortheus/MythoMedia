import React, {useEffect, useState} from 'react'
import styles from "../../static/css/component.module.css";
import FriendRequest from "./FriendRequest";
import axiosInstance from "./axiosApi";
import PerfectScrollbar from "react-perfect-scrollbar";

const FriendRequests = ({oldFriends, onUpdateCallback}) => {
    const [requests, setRequests] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("CALLBACK FRIENDS", oldFriends)
                const user_ID = sessionStorage.getItem('user_id')
                const data = await getRequests();
            } catch (error) {
                console.error(error)
            }

        };
        fetchData();
    }, [])

    const getRequests = async () => {
        try {
            const response = await axiosInstance.get('/friends/requests');
            setRequests(response.data)
            console.log("Requests", response.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <PerfectScrollbar style={{height: '400px'}}>
                {requests.length > 0 ? (
                    requests.map((request, index) => {
                        if (request.is_active) {
                            return (
                                <FriendRequest
                                    request={request}
                                    onResponseCallback={setRequests}
                                    old={requests}
                                    oldFriends={oldFriends}
                                    onUpdateCallback={onUpdateCallback}
                                />
                            );
                        }
                        return null;
                    })
                ) : (
                    <p>No demigod requests</p>
                )}
            </PerfectScrollbar>
        </>
    );
}

export default FriendRequests