import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import {MDBBtn} from "mdb-react-ui-kit";
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = ({onLogOutCallback}) => {
    const navigate = useNavigate()
    const handleLogOut = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('profile_pic');
        navigate('/login');
    }
    return (
        <button className="mb-4 px-5 mx-5 w-100 custom-rounded gold" size='lg' onClick={handleLogOut}><LogoutIcon/>Logout</button>
    )
}

export default LogoutButton