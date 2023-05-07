import React, {useEffect} from 'react'
import RegisterUser from './RegisterUser'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate} from "react-router-dom";

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RegisterUser/>}/>
            </Routes>
        </Router>
    )
}
export default Routing