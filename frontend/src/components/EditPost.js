import React, {useState} from 'react'
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
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

    function isEditable (time)  {
        const postedAt = new Date(time)
        console.log(time)
        const currentTime = new Date()
        const duration = 59 * 60 * 1000
        console.log(currentTime - postedAt < duration)
        return currentTime - postedAt < duration


    }
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
            {isEditable(post.posted_at) &&
            <Button onClick={handleClickOpen}>
                <MoreVertIcon/>
            </Button>
            }
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
                            multiline={true}
                            value={post_body}
                            onChange={(e) => setPostBody(e.target.value)}
                        />
                        <ImageUpload onImageSelect={setImage}/>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" className={styles.button}>Update</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );

};
export default EditPost
