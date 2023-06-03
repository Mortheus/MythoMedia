import React, {useState} from 'react'
import styles from "../../static/css/component.module.css";
import axiosInstance from "./axiosApi";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import ImageUpload from "./ImageUpload";
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';


const Friend = ({friend, onUnfriendCallback}) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const blockUser = async () => {
        try {
            await axiosInstance.post('/friends/block_user/' + friend.username)
            onUnfriendCallback(friend)
        } catch (error) {
            console.error(error)
        }
    }
    const removeFriend = async () => {
        try {
            await axiosInstance.delete('/friends/remove-friend/' + friend.username)
            onUnfriendCallback(friend)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <div className={styles.request_card}>
                <p>{friend.username}</p>
                <p>FRIENDS</p>
                <img className={styles.avatar} src={friend.profile_picture} alt="friend_profile"/>
                <p>{friend.mutual_friends}</p>
                <Button onClick={handleClickOpen}><MoreVertIcon/></Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogContent>
                        <div>
                            <p>Remove {friend.username} from friendlist</p>
                            <Button onClick={removeFriend}><DeleteIcon/></Button>
                        </div>
                        <div>
                            <p>Block {friend.username}</p>
                            <Button onClick={blockUser}><BlockIcon/></Button>
                        </div>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )

}

export default Friend