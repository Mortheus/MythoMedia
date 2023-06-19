import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ImageUpload from "./ImageUpload";
import {useAuth} from "./AuthContext";

const CreatePost = ({onCreateCallback, old}) => {
    const [post_body, setPostBody] = useState("");
    const [tags, setTags] = useState();
    const [image, setImage] = useState("");
    const {loggedUser} = useAuth()
    console.log(loggedUser)

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
            const response = await axiosInstance.post("/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPostBody('');
            setTags('');
            setImage(null);
            const updated_posts = [response.data, ...old]
            onCreateCallback(updated_posts)

        } catch (error) {
            console.error(error)
        }
    }
    if (!loggedUser) {
        return null
    }

    return (
        <div>
            <div className="card shadow-0">
                <form onSubmit={handleCreate} encType="multipart/form-data">
                    <div className="card-body border-bottom pb-2">
                        <div className="d-flex">
                            <img src={loggedUser.profile_picture}
                                 className="rounded-circle"
                                 height="50" alt="Avatar" loading="lazy"/>
                            <div className="d-flex align-items-center w-100 ps-3">
                                <div className="w-100">
                                    <TextField
                                        className="form-control form-status border-0 py-1 px-0"
                                        placeholder="What's happening"
                                        id="body"
                                        required
                                        value={post_body}
                                        onChange={(e) => setPostBody(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <ul className="list-unstyled d-flex flex-row ps-3 pt-3" style={{marginLeft: "50px"}}>
                                <li>
                                    <ImageUpload onImageSelect={setImage}/>
                                </li>
                            </ul>
                            <div className="d-flex align-items-center">
                                <button type="submit" className="btn btn-primary btn-rounded">Post</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreatePost