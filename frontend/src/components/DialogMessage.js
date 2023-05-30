import React, {useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axiosInstance from "./axiosApi";
import ChatIcon from '@mui/icons-material/Chat';

const DialogMessage = ({username}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post('/chats/create-personal/' + username)
            console.log(response.data)
            await axiosInstance.post('/chats/add-message/' + response.data.id.toString(), {
                'body': message
            })
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

    return (
        <div>
            <Button onClick={handleClickOpen}>
                <ChatIcon/>
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Start chatting</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Say something to start the conversation
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreate}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DialogMessage