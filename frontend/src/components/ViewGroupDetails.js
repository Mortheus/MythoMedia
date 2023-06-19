import React, {useEffect, useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import {convertTime} from "./Comment"
import EditGroup from "./EditGroup"
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from 'react-router-dom'
import {useAuth} from "./AuthContext";


const ViewGroupDetails = ({group_ID, onleaveCallback, old, onrefreshCallback, isPrivate}) => {
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("")
    const [created, setCreated] = useState("")
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [toAdd, setToAdd] = useState([]);
    const [newSelected, setNewSelected] = useState([])
    const [friends, setFriends] = useState([])
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [owner, setOwner] = useState()
    const [leaveMessage, setLeaveMessage] = useState("");
    const navigate = useNavigate()
    const {loggedUser} = useAuth()

    useEffect(() => {
        (async () => {
            await groupDetails()

            const responseMembers = await getMembers()

            const responseFriends = await getFriends(21)

            setMembers(responseMembers.data)
            setFriends(responseFriends.data)
            const nonMemberFriends = responseFriends.data.filter(
                (friend) => !responseMembers.data.some((member) => member.username === friend.username)
            )
            setToAdd(nonMemberFriends)
        })()
    }, [group_ID])


    useEffect(() => {
        if (friends) {
            const nonMemberFriends = friends.filter(
                (friend) => !members.some((member) => member.username === friend.username)
            );
            setToAdd(nonMemberFriends)
        }
    }, [members])


    function DeleteCallback(updatedMembers) {
        setMembers(updatedMembers)
    }

    const handleAddDialog = (e) => {
        setAddDialogOpen(!addDialogOpen)
    }
    const getMembers = async () => {
        try {
            return await axiosInstance.get('/chats/members/' + group_ID.toString())
        } catch (error) {
            console.error("ERROR GET MEMBERS", error)
            // console.error(error)
        }
    }

    const groupDetails = async () => {
        try {
            const response = await axiosInstance.get('/chats/view-details/' + group_ID);
            console.log('GROUP DETAILS')
            console.log(response.data)
            setDescription(response.data.description)
            setName(response.data.name)
            setImage(response.data.image)
            setCreated(response.data.created_at)
            setOwner(response.data.group_owner)
        } catch (error) {
            console.error("ERROR GROUP DETAILS", error)
        }
    }

    const handleNewUserSelect = (user) => {
        setNewSelected((prevNewSelected) => {
            if (prevNewSelected.includes(user)) {
                return prevNewSelected.filter((selectedUser) => selectedUser.username !== user.username);
            } else {

                return [...prevNewSelected, user];
            }
        });
    };

    const getFriends = async (user_ID) => {
        try {
            return await axiosInstance.get('/friends/friends/' + user_ID.toString())
        } catch (error) {
            console.error("ERROR GET FRIENDS", error)
            // console.error(error)
        }
    }

    const handleAddPeople = async (e) => {
        try {
            for (const user of newSelected) {
                await axiosInstance.post('/chats/add/' + group_ID + '/' + user.username)
            }
            setMembers([...members, ...newSelected]);
            setNewSelected([])

        } catch
            (error) {
            console.error("ERROR ADD PEOPLE", error)
            // console.error(error)
        }
    }
    const handleLeave = async (e) => {
        e.preventDefault()
        const response = await axiosInstance.delete('/chats/leave/' + group_ID.toString())
        setLeaveDialogOpen(!leaveDialogOpen)
        setLeaveMessage(response.data)
        console.log(old)
        const newGroups = old.filter((group) => group.id !== group_ID)
        console.log(newGroups)
        onleaveCallback(newGroups)
        onrefreshCallback(null)
    };

    const handleLeaveDialog = (e) => {
        setLeaveDialogOpen(!leaveDialogOpen)
        setLeaveMessage("")
    }

    if (!loggedUser) {
        return null
    }
    console.log(owner, loggedUser.id)

    return (
        <div>
            {owner === loggedUser.id && <EditGroup
                group_ID={group_ID}
                members={members}
                handleDeleteCallback={DeleteCallback}/>}
            <div>
                <div className='d-flex flex-row ps-3 pt-5 pb-5 pl-3 text-center justify-content-center'>
                    <span className='h3 fw-bold mb-0'>{name}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px'}}>
                 <img style={{width: '150px', height: 'auto', objectFit: 'cover', borderRadius: '50%'}} src={image} alt="group_image"/>
                </div>
                <div className='d-flex flex-row text-center pb-3'>
                    <span className='h4 fw-bold mb-0'>Description:</span>
                </div>
                <p>{description}</p>
                <p>{convertTime(created)}</p>
            </div>
                <div className='d-flex flex-row pb-3 text-center'>
                    <span className='h4 fw-bold mb-0'>Members</span>
                </div>
            <div>
                {members.map((member, index) => (
                    <div>
                        <p>{member.username}</p>
                        <img className={styles.avatar} src={member.profile_picture} alt="picture"/>
                    </div>
                ))
                }
            </div>
            {!isPrivate &&
                <>
                    <Button onClick={handleAddDialog}>Add</Button>
                    <Button onClick={handleLeaveDialog}><LogoutIcon>Leave Group</LogoutIcon></Button>
                </>
            }

            <Dialog open={addDialogOpen} onClose={handleAddDialog}>
                <DialogTitle>Add Members</DialogTitle>
                <DialogContent>
                    <DialogContentText>Choose from your friends: </DialogContentText>
                    <div id="new_users">
                        {toAdd.map((user) => (
                            <div className={newSelected.includes(user) ? styles.member : ''}
                                 onClick={() => handleNewUserSelect(user)}>
                                <p>{user.username}</p>
                                <img className={styles.avatar} src={user.profile_picture} alt="friend_profile"/>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddPeople}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={leaveDialogOpen} onClose={handleLeaveDialog}>
                <DialogTitle>Leave Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>Do you really want to leave?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLeave}>Leave Group</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ViewGroupDetails