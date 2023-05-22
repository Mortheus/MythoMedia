import React, {useEffect} from 'react'
import {useState} from 'react'
import AboutMe from "./AboutMe";
import {decodeToken} from "react-jwt"
import axiosInstance from "./axiosApi";

const Homepage = () => {
    const [userID, setUserID] = useState()
    const [username, setUserName] = useState()
    const [email, setEmail] = useState()
    const [gender, setGender] = useState()
    const [picture, setPicture] = useState()
    const [bio, setBio] = useState()
    const [numberPosts, setNumberPosts] = useState()
    const [numberFriends, setNumberFriends] = useState()

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
            setUserName(response.data.username);
            setEmail(response.data.email);
            setBio(response.data.bio);
            setGender(response.data.gender);
            setPicture(response.data.profile_picture);
            setNumberPosts(response.data.number_of_posts);
            setNumberFriends(response.data.number_of_friends);
        } catch(error) {
            console.error(error)
        }
    }
    return (
        <>
            <AboutMe
                username={username}
                bio={bio}
                numberPosts={numberPosts}
                profilePicture={picture}/>

        </>
    )
}

export default Homepage