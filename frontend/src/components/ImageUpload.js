
import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import "../../static/css/customStyles.css"


const ImageUpload = ({onImageSelect}) => {
    const handleImage = (e) => {
        console.log(e.target.files[0]);
        onImageSelect(e.target.files[0]);
    };

    return (
        <div className="d-flex justify-content-center">
            <label htmlFor="customFile1">
                <i className="far fa-image pe-2"></i>
            </label>
            <input
                type="file"
                className="form-control d-none"
                id="customFile1"
                name="image"
                accept="image/*"
                onChange={handleImage}
            />
        </div>
    );
};

export default ImageUpload;