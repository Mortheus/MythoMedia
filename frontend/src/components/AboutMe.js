import React, {useState} from 'react'
import styles from "../../static/css/component.module.css";

const AboutMe = ({username, bio, numberPosts, profilePicture}) => {
    return (
        <>
            <div className={styles.card_profile}>
                <h1>{username}</h1>
                <h2>About me</h2>
                <p>{bio}</p>
                <p>{numberPosts}</p>
                <img className={styles.avatar} src={profilePicture} alt="profile"/>
            </div>
        </>
    )

}

export default AboutMe