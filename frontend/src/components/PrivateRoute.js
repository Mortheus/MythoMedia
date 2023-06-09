import React from 'react';
import {Outlet, Navigate} from 'react-router-dom'

const isAuthenticated = () => {
    const token = sessionStorage.getItem('access_token');
    return !!token;
}

const PrivateRoute = () => {
    return (
        isAuthenticated() ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoute;
