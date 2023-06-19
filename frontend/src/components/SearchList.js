import React, {useEffect, useState} from 'react'
import styles from "../../static/css/component.module.css";
import {useNavigate} from "react-router-dom";

const SearchList = ({users, onClickCallback}) => {
    const navigate = useNavigate()
    const filtered = users.map((user) =>
        <div className="d-flex flex-row" style={{width: '200px', columnGap: '15px', borderBottom: '1px solid #b3acab'}}
             onClick={() => handleNavigateProfile(user.username)}>
            <div>
                <img
                    src={user.profile_picture}
                    alt="avatar"
                    className="d-flex align-self-center me-3 avatar"
                    width="60"
                />
            </div>
            <div className="pt-1">
                <p className="fw-bold mb-0">{user.username}</p>
            </div>
        </div>)
    const handleNavigateProfile = (username) => {

        navigate(`/profile/${username}`);
        onClickCallback("");
    }
    return (
        <>
            {filtered}
        </>
    )
}


export default SearchList