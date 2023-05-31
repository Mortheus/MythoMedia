import React, {useEffect, useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axiosInstance from "./axiosApi";
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from "../../static/css/component.module.css";
import ImageUpload from "./ImageUpload";

const EditGroup = ({group_ID, members, handleDeleteCallback}) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("");
    const [selected, setSelected] = useState([])

    const handleUserSelect = (user) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(user)) {
                return prevSelected.filter((selectedUser) => selectedUser.username !== user.username);
            } else {
                console.log(selected)
                return [...prevSelected, user];
            }
        });
    };

    const editGroup = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('image', image);
            await axiosInstance.put('/chats/edit/' + group_ID.toString(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setName("")
            setDescription("")
            setImage(null)
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

    const handleModify = async (e) => {
        e.preventDefault()
        console.log('form button pressed')
        const toBeRemoved = [...selected]
        await editGroup()
        for (const user of selected) {
            await axiosInstance.delete('/chats/remove/' + group_ID + '/' + user.username)

        }
        const toPass = members.filter((member) => !selected.some((selected) => member.username === selected.username))
        console.log("Selected: ")
        console.log(selected)
        console.log("To pass: ")
        console.log(toPass)
        handleDeleteCallback(toPass)
        setSelected([])
        console.log("After set: ")
        console.log(selected)
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>
                <SettingsIcon/>
            </Button>
            <div>

            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <form onSubmit={handleModify} encType="multipart/form-data">
                        <ImageUpload onImageSelect={setImage}/>
                        <TextField
                            label="Name"
                            name="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            fullWidth
                        />
                        <div>
                            {members.map((member, index) => (
                                <div className={selected.includes(member) ? styles.member : ''}
                                     onClick={() => handleUserSelect(member)}>
                                    <p>{member.username}</p>
                                    <img className={styles.avatar} src={member.profile_picture} alt="picture"/>
                                </div>
                            ))
                            }
                        </div>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Confirm</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default EditGroup