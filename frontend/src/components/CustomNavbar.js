import React, {useEffect, useState} from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LogoutButton from './LogoutButton'
import LogoutIcon from "@mui/icons-material/Logout";
import {useAuth} from "./AuthContext";
import {MDBBtn} from "mdb-react-ui-kit";
import {useNavigate} from "react-router-dom";
import Search from "./Search";

const CustomNavbar = () => {
    const navigate = useNavigate()
    const {loggedUser, setAuth} = useAuth()


    const handleLogOut = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('profile_pic');
        setAuth(false)
        navigate('/login');
    }
    if (!loggedUser) {
        return null
    }
    return (
        <>
              <Navbar bg="dark" variant="dark">
                <Container style={{marginRight: '-5px'}}>
                    <Navbar.Brand href={`/profile/${loggedUser.username}`}>Camp</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/friends">Demi-Gods</Nav.Link>
                        <Nav.Link href="/chats">Chronicles</Nav.Link>
                        <Nav.Link href="/blocked">Exiled</Nav.Link>
                        <Nav.Link href="/feed">Tales</Nav.Link>
                    </Nav>
                    <Nav style={{display: 'flex', alignItems: 'flex-end', gap: '8px'}}>
                        <Search/>
                        <button className="mb-4 px-5 mx-5 w-20 custom-rounded gold" onClick={handleLogOut}>
                            <LogoutIcon/> Logout
                        </button>
                    </Nav>
                </Container>
            </Navbar>


        </>
    )
};
export default CustomNavbar