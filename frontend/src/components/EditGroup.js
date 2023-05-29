import React, {useEffect, useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axiosInstance from "./axiosApi";
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from "../../static/css/component.module.css";

const EditGroup = ({group_ID}) => {
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selected, setSelected] = useState([])
    const [newSelected, setNewSelected] = useState([])
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [leaveMessage, setLeaveMessage] = useState("");
    const [friends, setFriends] = useState([]);
    const [toAdd, setToAdd] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    useEffect(() => {
        getMembers()
        getFriends(21)
    }, [])

    const handleUserSelect = (username) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(username)) {
                return prevSelected.filter((name) => name !== username);
            } else {
                console.log(selected)
                return [...prevSelected, username];
            }
        });
    };

    const handleNewUserSelect = (username) => {
        setNewSelected((prevNewSelected) => {
            if (prevNewSelected.includes(username)) {
                return prevNewSelected.filter((name) => name !== username);
            } else {
                return [...prevNewSelected, username];
            }
        });
    };

    const getMembers = async () => {
        try {
            const response = await axiosInstance.get('/chats/members/' + group_ID.toString())
            setMembers(response.data)
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const editGroup = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            await axiosInstance.put('/chats/edit/' + group_ID.toString(), formData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLeave = async (e) => {
        e.preventDefault()
        const response = await axiosInstance.delete('/chats/leave/' + group_ID.toString())
        setLeaveDialogOpen(true)
        setLeaveMessage(response.data)
    };

    const handleCloseLeaveDialog = (e) => {
        setLeaveDialogOpen(false)
        setLeaveMessage("")
    }

    const handleAddDialog = (e) => {
        setAddDialogOpen(false)
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

    const handleAdd = async (e) => {
        e.preventDefault()
        const user_ID = sessionStorage.getItem('user_id');
        try {
            await getFriends(user_ID)
            const nonMemberFriends = friends.filter(
                (friend) => !members.some((member) => member.id === friend.id)
            );
            setToAdd(nonMemberFriends)

        } catch (error) {
            console.log(error)
        }
    }
    const handleModify = async (e) => {
        e.preventDefault()
        console.log('form button pressed')
        await editGroup()
        for (const username of selected) {
            await axiosInstance.delete('/chats/remove/' + group_ID + '/' + username)
        }
    }

    return (
        <div>
            {/*<Button onClick={handleClickOpen}>*/}
            {/*    <SettingsIcon/>*/}
            {/*</Button>*/}
            {/*<Dialog open={open} onClose={handleClose}>*/}
            {/*    <DialogTitle>Edit Group</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText>*/}

            {/*        </DialogContentText>*/}
            {/*        <form onSubmit={handleModify}>*/}
            {/*            <TextField*/}
            {/*                label="Name"*/}
            {/*                name="name"*/}
            {/*                value={name}*/}
            {/*                onChange={(e) => {*/}
            {/*                    setName(e.target.value)*/}
            {/*                }}*/}
            {/*                fullWidth*/}
            {/*            />*/}
            {/*            <TextField*/}
            {/*                label="Description"*/}
            {/*                name="description"*/}
            {/*                value={description}*/}
            {/*                onChange={(e) => {*/}
            {/*                    setDescription(e.target.value)*/}
            {/*                }}*/}
            {/*                fullWidth*/}
            {/*            />*/}
            {/*            <div>*/}
            {/*                {members.map((member, index) => (*/}
            {/*                    <div className={selected.includes(member.username) ? styles.member : ''}*/}
            {/*                         onClick={() => handleUserSelect(member.username)}>*/}
            {/*                        <p>{member.username}</p>*/}
            {/*                        <img className={styles.avatar} src={member.profile_picture} alt="picture"/>*/}
            {/*                    </div>*/}
            {/*                ))*/}
            {/*                }*/}
            {/*            </div>*/}
            {/*            <DialogActions>*/}
            {/*                <Button onClick={handleClose}>Cancel</Button>*/}
            {/*                <Button type="submit">Confirm</Button>*/}
            {/*                <Button onClick={handleLeave}>Leave Group</Button>*/}
            {/*                <Button onClick={handleAdd}>+</Button>*/}
            {/*            </DialogActions>*/}
            {/*        </form>*/}
            {/*    </DialogContent>*/}
            {/*</Dialog>*/}
            {/*<Dialog open={leaveDialogOpen} onClose={handleCloseLeaveDialog}>*/}
            {/*    <DialogTitle>Leave Group</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText>{leaveMessage}</DialogContentText>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleCloseLeaveDialog}>OK</Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
            {/*<Dialog open={addDialogOpen} onClose={handleAddDialog}>*/}
            {/*    <DialogTitle>Add Members</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <DialogContentText>Choose from your friends: </DialogContentText>*/}
            {/*        <div id="new_users">*/}
            {/*            {toAdd.map((user) => (*/}
            {/*                <div className={newSelected.includes(user.username) ? styles.member : ''} onClick={() => handleNewUserSelect(user.username)}>*/}
            {/*                    <p>{user.username}</p>*/}
            {/*                    <img className={styles.avatar} src={user.profile_picture} alt="friend_profile"/>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        /!*<Button onClick={handleCloseLeaveDialog}>OK</Button>*!/*/}
            {/*        <Button onClick={handleAdd}>UFF</Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </div>
    );
}

export default EditGroup