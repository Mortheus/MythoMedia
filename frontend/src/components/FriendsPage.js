import React, {useState} from 'react'
import FriendList from './FriendList'
import axiosInstance from "./axiosApi";
import {useEffect} from "react";
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInputGroup,
    MDBRow,
    MDBTypography
} from "mdb-react-ui-kit";
import CreateGroup from "./CreateGroup";
import PerfectScrollbar from "react-perfect-scrollbar";
import Conversation from "./Conversation";
import ViewGroupDetails from "./ViewGroupDetails";

const FriendsPage = () => {
    const [friends, setFriends] = useState([])
    useEffect(() => {
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