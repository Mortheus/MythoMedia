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

const EditPost = ({post, onEditCallback}) => {
    const [open, setOpen] = useState(false);
    const [post_body, setPostBody] = useState(post.description);
    const [tags, setTags] = useState(post.tags);
    const [image, setImage] = useState("");
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (image instanceof File) {
            console.log("File selected:", image);
        } else {
            console.log("No file selected or invalid file type");
        }
        const formData = new FormData();
        formData.append('description', post_body);
        formData.append('tags', tags);
        if (image instanceof File) {
            formData.append('image', image);
        }
        try {
            const response = await axiosInstance.put("/posts/edit/" + post.id.toString(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onEditCallback(response.data)

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <Button onClick={handleClickOpen}>
                <SettingsIcon/>
            </Button>
            <div>

            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <form onSubmit={handleEdit} encType="multipart/form-data">
                        <TextField
                            id="body"
                            label="Body"
                            required
                            value={post_body}
                            onChange={(e) => setPostBody(e.target.value)}
                        />
                        <TextField
                            id="tags"
                            label="Tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <ImageUpload onImageSelect={setImage}/>
                        <Button type="submit" className={styles.button} variant="contained">
                            Update
                        </Button>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Confirm</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );

};
export default EditPost

// <div className={styles.card_profile}>
// </div>