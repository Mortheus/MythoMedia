import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ImageUpload from "./ImageUpload";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SettingsIcon from "@mui/icons-material/Settings";

const PostHistory = ({post_id}) => {
    const [history, setHistory] = useState([])
    const [open, setOpen] = useState(false);
    useEffect(() => {
        getHistory()
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const getHistory = async () => {
        try {
            const response = await axiosInstance.get('/posts/all_edits/' + post_id.toString())
            setHistory(response.data)
            console.log(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Button onClick={handleClickOpen}>
                Edit History
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        { history.length > 0 ?  (
                            history.map((edit) => (
                                <div key={edit.id}>
                                    <p>{edit.updated_description}</p>
                                    <p>{edit.updated_tags}</p>
                                    <p>{edit.updated_at}</p>
                                </div>))
                        ) : (
                            <p>No edits so far</p>
                            )
                        }

                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default PostHistory