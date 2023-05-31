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
import Search from "./Search";


const ViewGroupDetails = ({group_ID}) => {
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

    useEffect(async () => {
        await groupDetails()
        const responseMembers = await getMembers()
        const responseFriends = await getFriends(21)


        setMembers(responseMembers.data)
        setFriends(responseFriends.data)
        const nonMemberFriends = responseFriends.data.filter(
            (friend) => !responseMembers.data.some((member) => member.username === friend.username)
        );
        setToAdd(nonMemberFriends)
    }, [])

    useEffect(() => {
        if (friends) {
            const nonMemberFriends = friends.filter(
                (friend) => !members.some((member) => member.username === friend.username)
            );
            setToAdd(nonMemberFriends)
        }
    }, [members])

    const user_ID = sessionStorage.getItem('used_id')

    function DeleteCallback(updatedMembers) {
        console.log('Callback')
        setMembers(updatedMembers)
    }

    const handleAddDialog = (e) => {
        setAddDialogOpen(!addDialogOpen)
    }
    const getMembers = async () => {
        try {
            return await axiosInstance.get('/chats/members/' + group_ID.toString())
        } catch (error) {
            console.error(error)
        }
    }

    const groupDetails = async () => {
        try {
            const response = await axiosInstance.get('/chats/view-details/' + group_ID);
            setDescription(response.data.description)
            setName(response.data.name)
            setImage(response.data.image)
            setCreated(response.data.created_at)
            setOwner(response.data.group_owner)
        } catch (error) {
            console.error(error)
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
            console.error(error)
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
            console.error(error)
        }
    }
    const handleLeave = async (e) => {
        e.preventDefault()
        const response = await axiosInstance.delete('/chats/leave/' + group_ID.toString())
        setLeaveDialogOpen(!leaveDialogOpen)
        setLeaveMessage(response.data)
    };

    const handleLeaveDialog = (e) => {
        setLeaveDialogOpen(!leaveDialogOpen)
        setLeaveMessage("")
    }


    return (
        <div>
            {/*{ owner === user_ID && <EditGroup*/}
            {/*    group_ID={group_ID}*/}
            {/*    members={members}*/}
            {/*handleDeleteCallback={DeleteCallback}/>}*/}
            <EditGroup
                group_ID={group_ID}
                members={members}
                handleDeleteCallback={DeleteCallback}/>
            <div>
                <p>{name}</p>
                <p>{description}</p>
                <p>{convertTime(created)}</p>
                <img className={styles.avatar} src={image} alt="group_image"/>
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
            <Button onClick={handleAddDialog}>Add</Button>
            <Button onClick={handleLeaveDialog}><LogoutIcon>Leave Group</LogoutIcon></Button>
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