import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
    const [post_body, setPostBody] = useState();
    const [tags, setTags] = useState();
    const [image, setImage] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        if (image instanceof File) {
            console.log("File selected:", image);
        } else {
            console.log("No file selected or invalid file type");
        }
        const formData = new FormData();
        formData.append('description', post_body);
        formData.append('tags', tags);
        console.log(image)
        formData.append('image', image);
        console.log(formData.get('image'))
        try {
            await axiosInstance.post("/posts", formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPostBody('');
            setTags('');
            setImage(null);

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.card_profile}>
        <form onSubmit={handleCreate} encType="multipart/form-data">
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
                Create Post
            </Button>
        </form>
            </div>
    );
};
export default CreatePost