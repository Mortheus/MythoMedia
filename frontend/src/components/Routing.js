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

const Routing = () => {
    return (
        <>
            <CustomNavbar/>
            <Routes>
                <Route path="/" element={<RegisterUser/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route element={<Homepage/>} path='homepage'/>
                    <Route element={<FriendsPage/>} path='friends'/>
                    <Route element={<ChatPage/>} path='chats'/>
                </Route>
            </Routes>
        </>
    )
}
export default Routing