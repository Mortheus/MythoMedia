import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";

import "../../static/css/customStyles.css"
import BlockedUser from "./BlockedUser";
import {MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow, MDBTypography} from "mdb-react-ui-kit";
import PerfectScrollbar from "react-perfect-scrollbar";
import Friend from "./Friend";
import FriendRequests from "./FriendRequests";


const BlockList = () => {
    const [blockedUsers, setBlockedUsers] = useState([])
    useEffect(() => {
        getBlockedUsers()
    }, [])
    useEffect(() => {
    }, [blockedUsers])
    const getBlockedUsers = async () => {
        try {
            const response = await axiosInstance.get('/friends/blocked_users')
            setBlockedUsers(response.data)
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const removeCallback = (user) => {
        const updated_blocks = blockedUsers.filter((blocked) => blocked.id !== user.id)
        setBlockedUsers(updated_blocks)

    }
    return (
        <>
            <MDBContainer fluid className="py-5" style={{backgroundColor: "#A29057"}}>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard id="chat3" style={{borderRadius: "15px"}}>
                            <MDBCardBody>
                                <div className="p-3">
                                    <div>
                                        <h2>Exiled Users</h2>
                                    </div>
                                    <PerfectScrollbar style={{height: '400px'}}>
                                        <MDBTypography listUnStyled className="mb-0" style={{paddingRight: '14px'}}>
                                            <div className="friend_requests">
                                                {blockedUsers.length > 0 ? (
                                                    blockedUsers.map((user, index) => (
                                                        <BlockedUser
                                                            blockedUser={user}
                                                            onRemoveCallback={removeCallback}
                                                        />
                                                    ))
                                                ) : (
                                                    <p>No blocked users</p>
                                                )}
                                            </div>
                                        </MDBTypography>
                                    </PerfectScrollbar>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
}

export default BlockList