import React, {useEffect, useState} from 'react'
import Friend from "./Friend";
import {useNavigate} from "react-router-dom";
import axiosInstance from "./axiosApi";
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInputGroup,
    MDBRow,
    MDBTypography
} from "mdb-react-ui-kit";
import CreateGroup from "./CreateGroup";
import PerfectScrollbar from "react-perfect-scrollbar";
import FriendRequests from "./FriendRequests";

const FriendList = () => {
    const [friends, setFriends] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user_ID = sessionStorage.getItem('user_id');
                const data = await getFriends(user_ID);
                console.log()

            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     console.log("FRIENDS STATE CHANGED: ")
    //     console.log(friends)
    //
    // }, [friends])

    const unFriendCallback = (user) => {
        const updatedFriends = friends.filter((friend) => friend.username !== user.username)
        setFriends(updatedFriends)
    }
    const getFriends = async (user_ID) => {
        try {
            const response = await axiosInstance.get('/friends/friends/' + user_ID.toString());
            setFriends(response.data)
            console.log(response.data)

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <MDBContainer fluid className="py-5" style={{backgroundColor: "#A29057"}}>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard id="chat3" style={{borderRadius: "15px"}}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                                        <div className="p-3">
                                            <PerfectScrollbar style={{height: '400px'}}>
                                                <MDBTypography listUnStyled className="mb-0"
                                                               style={{paddingRight: '14px'}}>
                                                    <div className="text-center">
                                                    <h2>Allied Demi-Gods</h2>
                                                    </div>
                                                    {friends && friends.length > 0 ? (
                                                        friends.map((friend, index) => (
                                                            <Friend friend={friend}
                                                                    onUnfriendCallback={unFriendCallback}/>
                                                        ))
                                                    ) : (
                                                        <div className="text-center">
                                                            {friends ? (
                                                                <p>No allies found.</p>
                                                            ) : (
                                                                <div className="spinner-border" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </MDBTypography>
                                            </PerfectScrollbar>
                                        </div>
                                    </MDBCol>
                                    <MDBCol md="6" lg="7" xl="8">
                                         <div className="text-center">
                                                    <h2>Demigod Requests</h2>
                                                    </div>
                                        <div className="friend_requests">
                                            <FriendRequests oldFriends={friends} onUpdateCallback={setFriends}/>
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )
}
export default FriendList