import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";
import BlockedUser from "./BlockedUser";


const BlockList = () => {
    const [blockedUsers, setBlockedUsers] = useState([])
    useEffect(() => {
        getBlockedUsers()
    }, [])
    useEffect(() => {
        console.log("STATE HAS CHANGED: ")
        console.log(blockedUsers)
    }, [blockedUsers])
    const getBlockedUsers = async () => {
        try {
            const response = await axiosInstance.get('/friends/blocked_users')
            setBlockedUsers(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const removeCallback = (user) => {
        const updated_blocks = blockedUsers.filter((blocked) => blocked.id !== user.id)
        setBlockedUsers(updated_blocks)

    }
    return (

        blockedUsers.length > 0 ? (
            blockedUsers.map((user, index) => (
                <BlockedUser
                    blockedUser={user}
                    onRemoveCallback={removeCallback}/>
            ))
        ) : (
            <p>No blocked users</p>
        )

    )
}

export default BlockList