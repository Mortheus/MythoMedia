import React, {useEffect} from 'react'
import {useState} from 'react'
import AboutMe from "./AboutMe";
import {decodeToken} from "react-jwt"
import axiosInstance from "./axiosApi";
import FriendRequests from "./FriendRequests";
import Feed from "./Feed";
import CreatePost from "./CreatePost";
import Comments from "./Comments";
import Chats from "./Chats";
import CreateGroup from "./CreateGroup";
import CreatePersonalGroup from "./CreatePersonalGroup";
import DialogMessage from "./DialogMessage";
import EditGroup from "./EditGroup";

const Homepage = () => {
    const [userID, setUserID] = useState()
    const [user, setUser] = useState(null)

    useEffect(async () => {
        const fetchData = async () => {
            try {
                const user_ID = sessionStorage.getItem('user_id');
                setUserID(user_ID)
                await getUserDetails(user_ID);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);


    const getUserDetails = async (user_ID) => {
        try {
            const response = await axiosInstance.get('/user/' + user_ID.toString())
            console.log(response.data);
            setUser(response.data);
            sessionStorage.setItem('username', response.data.username);
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            {user ? (
                <>
                    <AboutMe
                        username={user.username}
                        bio={user.bio}
                        numberPosts={user.numberPosts}
                        profilePicture={user.profile_picture}/>
                    <Comments
                        post_id={17}/>
                    {/*<Feed*/}
                    {/*    username={user.username}/>*/}
                    {/*<Chats/>*/}
                    {/*<CreateGroup/>*/}
                    {/*<DialogMessage*/}
                    {/*username={'Heart'}/>*/}
                    {/*<EditGroup*/}
                    {/*group_ID={28}/>*/}
                </>
            ) : (
                <p>Loading...</p>
            )}
            {/*<FriendRequests/>*/}

            {/*<CreatePost/>*/}


        </>
    )
}

export default Homepage