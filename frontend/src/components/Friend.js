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
import {useNavigate} from "react-router-dom";


const Friend = ({friend, onUnfriendCallback}) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
     const handleNavigateProfile = (username) => {

        navigate(`/profile/${username}`);
    }

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
            <div className="p-2 border-bottom dots">
                <div
                    className="d-flex justify-content-between align-items-center"> {/* Modified class */}
                    <div className="d-flex flex-row"
                         onClick={() => handleNavigateProfile(friend.username)}>
                        <div>
                            <img
                                src={friend.profile_picture}
                                alt="avatar"
                                className="d-flex align-self-center me-3 avatar"
                                width="60"
                            />
                        </div>
                        <div className="pt-1">
                            <p className="fw-bold mb-0">{friend.username}</p>
                            <p className="fw-bold mb-0">Mutual friend: {friend.mutual_friends}</p>
                        </div>
                    </div>
                    <div>
                        <Button onClick={handleClickOpen}><MoreVertIcon/></Button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Friend