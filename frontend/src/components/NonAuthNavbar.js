import React, {useEffect, useState} from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import LogoutButton from './LogoutButton'
import LogoutIcon from "@mui/icons-material/Logout";
import {useAuth} from "./AuthContext";
import {MDBBtn} from "mdb-react-ui-kit";
import {useNavigate} from "react-router-dom";

const CustomNavbar = () => {
    const navigate = useNavigate()
    const {setAuth} = useAuth()

    const handleLogOut = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('profile_pic');
        setAuth(false)
        navigate('/login');
    }
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/login">MythoMedia</Navbar.Brand>
                    <Nav className="me-auto">
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
};
export default CustomNavbar