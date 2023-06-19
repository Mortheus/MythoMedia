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
import ViewGroupDetails from "./ViewGroupDetails";
import Conversation from "./Conversation";
import Search from "./Search"
import UpdateUser from "./UpdateUser";
import BlockList from "./BlockList";
import FriendsPage from "./FriendsPage";
import SendFriendRequest from "./SendFriendRequest";

const Homepage = () => {
    const [userID, setUserID] = useState()
    const [user, setUser] = useState(null)
    const [updated, setUpdated] = useState(false)

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("State for user Changed: ")
        console.log(user)
    }, [user])

    const fetchData = async () => {
        try {
            const user_ID = sessionStorage.getItem('user_id');
            setUserID(user_ID)
            await getUserDetails(user_ID);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function EditCallback(user) {
        setUser(user)

    }

    const getUserDetails = async (user_ID) => {
        try {
            const response = await axiosInstance.get('/user/' + user_ID.toString())
            console.log(response.data);
            setUser(response.data);
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('profile_pic', response.data.profile_picture);
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
                    {/*<CreatePersonalGroup username={"Fob2"}/>*/}
                    <Search/>
                    {/*<FriendsPage/>*/}
                    {/*<SendFriendRequest*/}
                    {/*username={'Heart'}></SendFriendRequest>*/}
                    {/*onEditCallback={EditCallback}/>*/}
                    {/*<CreatePost/>*/}
                    {/*<Conversation*/}
                    {/*    chat_id={28}/>*/}
                    {/*<Comments*/}
                    {/*    post_id={17}/>*/}
                    {/*<ViewGroupDetails*/}
                    {/*    group_ID={28}/>*/}
                    {/*<Search*/}
                    {/*    details={friends}/>*/}
                    {/*<Feed*/}
                    {/*    username={user.username}/>*/}
                    {/*<BlockList/>*/}
                    {/*<Chats/>*/}
                    {/*<CreateGroup/>*/}
                    {/*<DialogMessage*/}
                    {/*username={'Heart'}/>*/}
                    {/*<EditGroup*/}
                    {/*group_ID={28}/>*/}
                    {/*<FriendRequests/>*/}
                    <CreatePost/>
                </>
            ) : (
                <p>Loading...</p>
            )}


        </>
    )
}

export default Homepage