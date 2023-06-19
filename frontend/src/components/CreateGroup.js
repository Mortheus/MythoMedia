import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {MDBIcon} from "mdb-react-ui-kit";
import {useAuth} from "./AuthContext";

const CreateGroup = () => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [friends, setFriends] = useState([])
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)
    const {loggedUser} = useAuth()

    const handleOpenDialog = (e) => {
        setOpen(!open)
    }

    useEffect(() => {
        if (loggedUser) {
            fetchData();
        }
    }, [loggedUser]);

    const fetchData = async () => {
        console.log(loggedUser)
        try {
            if (loggedUser) {
                const response = await axiosInstance.get(`/friends/friends/${loggedUser.id}`);
                setFriends(response.data)
                console.log(response.data)
            } else {
                console.log("error", loggedUser)
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };
    const isUserSelected = (username) => {
        return selected.includes(username)
    }
    const handleUserSelect = (username) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(username)) {
                return prevSelected.filter((name) => name !== username);
            } else {
                return [...prevSelected, username];
            }
        });
    };
    const handleCreate = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', name)
        formData.append('description', description)
        try {
            const response = await axiosInstance.post('/chats/create-group', formData)
            console.log("RESPONSE CREATE", response.data)
            setName('');
            setDescription('');
            for (const username of selected) {
                await axiosInstance.post('/chats/add/' + response.data.id.toString() + '/' + username)
            }
        } catch (error) {
            console.error(error)
        }
    }
    if (!loggedUser) {
        return null
    }

    return (
        <>
            <Button onClick={handleOpenDialog}><i className="fas fa-user-group"></i> Create Group</Button>
            <Dialog open={open} onClose={handleOpenDialog}>
                <DialogTitle>Create new group</DialogTitle>
                <DialogContent>
                    <div className={styles.card_profile}>
                        <form onSubmit={handleCreate} encType="multipart/form-data">
                            <TextField
                                id="body"
                                label="Group"
                                value={name}
                                onChange={(e) => setName(e.target.value)}/>
                            <TextField
                                id="desc"
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}/>
                            <label htmlFor="users">Select Users:</label>
                            <div id="users">
                                {friends.map((user) => (
                                    <div className={`${styles.request_card} ${selected.includes(user.username) ? styles.member : ''}`}
                                         onClick={() => handleUserSelect(user.username)}>
                                        <p>{user.username}</p>
                                        <img className={styles.avatar} src={user.profile_picture} alt="friend_profile"/>
                                    </div>
                                ))}
                            </div>
                            <Button type="submit" className={styles.button} variant="contained">
                                Create Group
                            </Button>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </>
    )

}

export default CreateGroup