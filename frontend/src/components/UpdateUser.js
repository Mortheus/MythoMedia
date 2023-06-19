import React, { useState } from 'react';
import styles from "../../static/css/component.module.css";
import axiosInstance from "./axiosApi";
import { Form } from "react-router-dom";
import TextField from "@mui/material/TextField";
import ImageUpload from "./ImageUpload";
import { Checkbox, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const UpdateUser = ({ user, onEditCallback }) => {
  const [newBio, setNewBio] = useState(user.bio);
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState(user.gender);
  const [profilePicture, setProfilePicture] = useState("");
  const [isPrivate, setIsPrivate] = useState(user.is_private);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modifyUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      let formattedDate;
      if (birthdate) {
        formattedDate = new Date(birthdate).toISOString().split('T')[0];
      } else {
        formattedDate = "";
      }

      formData.append('bio', newBio);
      formData.append('birthdate', formattedDate);
      formData.append('gender', gender);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      formData.append('is_private', isPrivate);

      const response = await axiosInstance.put('/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onEditCallback(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <Button onClick={handleClickOpen}>
          <SettingsIcon /> Edit Profile
        </Button>
        <div></div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <form onSubmit={modifyUser} encType="multipart/form-data">
              <ImageUpload onImageSelect={setProfilePicture} />
              <TextField
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                label="Bio"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
                fullWidth
              >
                <MenuItem value={'M'}>Male</MenuItem>
                <MenuItem value={'F'}>Female</MenuItem>
                <MenuItem value={'A'}>Another</MenuItem>
                <MenuItem value={'N'}>Not Say</MenuItem>
              </Select>
              <InputLabel id="demo-simple-select-label">BirthDate</InputLabel>
              <DatePicker
                dateFormat="yyyy-MM-dd"
                selected={birthdate}
                onChange={(date) => setBirthdate(date)}
                className={styles.datePicker}
              />
              <InputLabel id="demo-simple-select-label">Private</InputLabel>
              <Checkbox
                name="Private"
                label="I agree"
                defaultChecked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UpdateUser;