import React, {useState} from 'react'
import styles from "../../static/css/component.module.css";


const Friend = ({username, profile_picture, mutual_friends}) => {
    return (
        <>
            <p>{username}</p>
            <img className={styles.avatar} src={profile_picture} alt="friend_profile"/>
            <p>{mutual_friends}</p>
        </>
    )

}

export default Friend