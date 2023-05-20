import React, {useEffect} from 'react'
import {useState} from 'react'
import AboutMe from "./AboutMe";

const Homepage = () => {
    const [userID, setUserID] = useState()
    // const user_ID = useContext(AuthContext)
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
                const user_ID = await getLoggedUser();
                setUserID(user_ID)
                await getUserDetails(user_ID);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);
    const getLoggedUser = () => {
        const token = sessionStorage.getItem('token')
        console.log(token)
        return fetch('http://127.0.0.1:8000/api/user/decode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}),
        })
            .then((response) => response.json())
            .then((data) => data.user_id)
            .catch((error) => {
                console.error('Something went wrong', error);
                console.error(userID)
            });

    };

    const getUserDetails = (user_ID) => {
        return fetch('http://127.0.0.1:8000/api/user/' + user_ID.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUserName(data.username);
                setEmail(data.email);
                setBio(data.bio);
                setGender(data.gender);
                setPicture(data.profile_picture);
                setNumberPosts(data.number_of_posts);
                setNumberFriends(data.number_of_friends);
            })
            .catch((error) => {
                console.error('Something went wrong', error);
            });
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