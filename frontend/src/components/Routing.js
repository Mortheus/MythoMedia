import React, {useEffect} from 'react'
import RegisterUser from './RegisterUser'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate} from "react-router-dom";
import LoginForm from "./LoginForm";
import Homepage from "./Homepage";
import PrivateRoute from "./PrivateRoute";
import {Home} from "@mui/icons-material";
import FriendsPage from "./FriendsPage";
import ChatPage from "./ChatPage";
import CustomNavbar from "./CustomNavbar";
import BlockList from "./BlockList";
import Feed from "./Feed";
import Profile from "./Profile";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";
import {useAuth} from "./AuthContext";
import NonAuthNavbar from "./NonAuthNavbar";
import PostPage from "./PostPage";
import AllFeed from "./AllFeed";

const Routing = () => {
    const {auth} = useAuth()
    return (
        <>
            {auth ? <CustomNavbar /> : <NonAuthNavbar/> }
            <Routes>
                <Route path="forgot-password" element={<ForgotPassword/>}/>
                <Route path="/register" element={<RegisterUser/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="reset/:uidb64/:token" element={<ResetPassword/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route element={<Homepage/>} path=''/>
                    <Route element={<FriendsPage/>} path='friends'/>
                    <Route element={<ChatPage/>} path='chats'/>
                    <Route element={<BlockList/>} path='blocked'/>
                    <Route element={<AllFeed/>} path='feed'/>
                    <Route element={<Profile username="Morthyy"/>} path='test'/>
                    <Route path="/profile/:username" element={<Profile/>}/>
                    <Route path="/post/:id" element={<PostPage/>}></Route>
                </Route>
            </Routes>
        </>
    )
}
export default Routing