import React, {useState} from 'react'
import Button from "@mui/material/Button";
import styles from "../../static/css/component.module.css";


const ImageUpload = ({onImageSelect}) => {
    const handleImage = (e) => {
        console.log(e.target.files[0])
        onImageSelect(e.target.files[0])
    }
    return (
        <div>
            <input type="file" name="image" onChange={handleImage}/>

        </div>
    )
}

export default ImageUpload