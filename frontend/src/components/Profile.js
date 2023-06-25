import React, {useEffect, useState} from 'react';
import "../../static/css/customStyles.css";
import axiosInstance from "./axiosApi";
import PlaceholderIMG from '../../static/images/MediaPlaceHolder.jpg'
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
import {useParams} from 'react-router-dom';
import CreateGroup from "./CreateGroup";
import PerfectScrollbar from "react-perfect-scrollbar";
import Conversation from "./Conversation";
import ViewGroupDetails from "./ViewGroupDetails";
import Feed from "./Feed";
import SendFriendRequest from "./SendFriendRequest";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from '@mui/icons-material/Person';
import UpdateUser from "./UpdateUser";
import CreatePersonalGroup from "./CreatePersonalGroup";
import {useAuth} from "./AuthContext";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [media, setMedia] = useState([]);
    const [isEdited, setIsEdited] = useState(false)
    const {username} = useParams();
    const [isFriend, setIsFriend] = useState(false)
    const {status} = useFriendStatus(username);
    const {block} = useBlockStatus(username);
    const {loggedUser} = useAuth()

    useEffect(() => {
        if (username !== null) {
            fetchData();
        }
    }, [username, isEdited]);


    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/auser/' + username);
            console.log(response.data);
            setUser(response.data);
            const response1 = await axiosInstance.get('/posts/user/' + username);
            setPosts(response1.data);
            console.log(response1.data);
            const user_ID = sessionStorage.getItem('user_id');
            const response2 = await axiosInstance.get('/friends/friends/' + user_ID.toString());
            setIsFriend(response2.data.some(friend => friend.username === username))
            console.log(response2.data.some(friend => friend.username === username))

        } catch (error) {
            console.error('Error:', error);
        }
    };
    if (!loggedUser) {
        return null
    }

    if (user === null) {
        return <div className="text-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
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
                                            <PerfectScrollbar style={{height: '500px'}}>
                                                <div>
                                                    <div className="rounded-top text-white d-flex flex-row"
                                                         style={{backgroundColor: '#000', height: '200px'}}>
                                                        <div className="ms-4 mt-5 d-flex flex-column"
                                                             style={{width: '150px'}}>
                                                            <img src={user.profile_picture}
                                                                 alt="Generic placeholder image"
                                                                 className="img-fluid img-thumbnail mt-4 mb-2"
                                                                 style={{width: '150px', zIndex: '1'}}/>
                                                            {user.username === loggedUser.username ? (
                                                                <div>
                                                                    <UpdateUser user={user}
                                                                                onEditCallback={setIsEdited}/>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {block ?
                                                                        (<Button variant="outlined"
                                                                                 disabled>Blocked</Button>
                                                                        ) : !isFriend ? (
                                                                            <div>
                                                                                <SendFriendRequest username={username}/>
                                                                                <CreatePersonalGroup
                                                                                    username={username}/>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <Button variant="outlined" disabled>
                                                                                    <PersonIcon/> Friends
                                                                                </Button>
                                                                                <CreatePersonalGroup
                                                                                    username={username}/>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            )}

                                                        </div>
                                                        <div className="ms-3" style={{marginTop: '130px'}}>
                                                            <h5>{user.username}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 text-black"
                                                         style={{backgroundColor: '#f8f9fa'}}>
                                                        <div className="d-flex justify-content-end text-center py-1">
                                                            <div>
                                                                <p className="mb-1 h5">{user.number_of_friends}</p>
                                                                <p className="small text-muted mb-0">Friends</p>
                                                            </div>
                                                            <div className="px-3">
                                                                <p className="mb-1 h5">{user.number_of_posts}</p>
                                                                <p className="small text-muted mb-0">Posts</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body p-4 text-black">
                                                        <div className="mb-5 mt-4">
                                                            <p className="lead fw-normal mb-1">About</p>
                                                            <div className="p-4" style={{backgroundColor: '#f8f9fa'}}>
                                                                {
                                                                    (block ? (
                                                                            <p className="font-italic mb-1">Blocked
                                                                                Account</p>
                                                                        ) : ((user.is_private && !status && loggedUser.id !== user.id)) ? (
                                                                            <p className="font-italic mb-1">Private
                                                                                Account</p>
                                                                        ) : (
                                                                            <div>
                                                                                <p className="font-italic mb-1">Bio: {user.bio}</p>
                                                                                <p className="font-italic mb-1">Gender: {user.gender}</p>
                                                                                <p className="font-italic mb-1">Birthdate: {user.birthdate}</p>
                                                                                <p className="font-italic mb-1">Date
                                                                                    Joined: {user.date_joined}</p>
                                                                            </div>
                                                                        )
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </PerfectScrollbar>
                                        </div>
                                    </MDBCol>
                                    <MDBCol md="6" lg="7" xl="8">
                                        {!block ? (
                                            <PerfectScrollbar style={{height: '450px'}}>
                                                <Feed username={username}/>
                                            </PerfectScrollbar>
                                        ) : (
                                            <p>You can't see the posts of a user that has blocked you.</p>
                                        )}
                                    </MDBCol>


                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )
        ;
};
const useFriendStatus = (username) => {
    const [status, setStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axiosInstance.get(`/friends/friendship_status/${username}`);
                setStatus(response.data.status)
                console.log(response.data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching friendship status: ', error);
            }
        };

        fetchStatus();
    }, []);

    return {status, isLoading};
}

const useBlockStatus = (username) => {
    const [block, setBlock] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axiosInstance.get(`/friends/blocked_status/${username}`);
                setBlock(response.data.status)
                setIsLoading(false)
                console.log("BLOCKED:", response.data.status)
            } catch (error) {
                console.error('Error fetching block status: ', error);
            }
        };

        fetchStatus();
    }, []);

    return {block, isLoading};
}
export default Profile;
