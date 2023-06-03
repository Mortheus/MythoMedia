import React, {useState, useEffect} from 'react'
import styles from "../../static/css/component.module.css";
import axiosInstance from "./axiosApi";
import {Form} from "react-router-dom";
import TextField from "@mui/material/TextField";
import ImageUpload from "./ImageUpload";
import {Checkbox, InputLabel, MenuItem, Select} from "@mui/material";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import {format, parseISO} from 'date-fns';


const UpdateUser = ({user, onEditCallback}) => {
    const [newBio, setNewBio] = useState(user.bio)
    const [birthdate, setBirthdate] = useState("")
    const [gender, setGender] = useState(user.gender)
    const [profilePicture, setProfilePicture] = useState("")
    const [isPrivate, setIsPrivate] = useState(user.is_private)


    // useEffect(() => {
    //     fetchData()
    // }, [])
    const modifyUser = async (e) => {
        e.preventDefault()
        try {
            const datee = "2021-12-20"
            console.log(typeof (format(parseISO(datee), "dd-MM-yyyy")));
            const formData = new FormData()
            let formattedDate
            console.log(typeof (birthdate))
            if (birthdate) {
                formattedDate = new Date(birthdate).toISOString().split('T')[0];
            } else {

                formattedDate = ""
            }
            console.log(formattedDate)
            // if (newBio) {
            formData.append('bio', newBio)
            // } else {
            //     formData.append('bio', user.bio)
            // }
            formData.append('birthdate', formattedDate)
            formData.append('gender', gender)
            if (profilePicture) {
                formData.append('profile_picture', profilePicture)
            }
            formData.append('is_private', isPrivate)
            const response = await axiosInstance.put('/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            onEditCallback(response.data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <form onSubmit={modifyUser} encType="multipart/form-data">
                <ImageUpload onImageSelect={setProfilePicture}/>
                <TextField
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}>
                    Bio
                </TextField>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                >
                    <MenuItem value={'M'}>Male</MenuItem>
                    <MenuItem value={'F'}>Female</MenuItem>
                    <MenuItem value={'A'}>Another</MenuItem>
                    <MenuItem value={'N'}>Not Say</MenuItem>
                </Select>
                <DatePicker
                    dateFormat="yyyy-MM-dd"
                    selected={birthdate}
                    onChange={(date) => {
                        // const formattedDate = format(parseISO(date), "yyyy-MM-dd");
                        // console.log(formattedDate)
                        setBirthdate(date);
                    }}
                />
                <Checkbox
                    name="Private"
                    label="I agree"
                    defaultChecked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}/>
                <Button type="submit">Save</Button>

            </form>
        </>
    )

}
export default UpdateUser