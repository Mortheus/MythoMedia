import React, {useState, useEffect} from 'react'
import axiosInstance from "./axiosApi";
import styles from "../../static/css/component.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const CreateGroup = () => {
    const [name, setName] = useState(null)
    const [description, setDescription] = useState("")
    const [friends, setFriends] = useState([])
    const [selected, setSelected] = useState([])

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const user_ID = sessionStorage.getItem('user_id');
            const response = await axiosInstance.get('/friends/friends/' + user_ID.toString());
            setFriends(response.data)
            console.log(response.data)

        } catch (error) {
            console.error('Error:', error);
        }
    };

const handleUserSelect = (username) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(username)) {
        return prevSelected.filter((name) => name !== username);
      } else {
              console.log(selected)
        return [...prevSelected, username];
      }
    });
  };
    const handleCreate = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', name)
        formData.append('description', description)
        try {
            const response = await axiosInstance.post('/chats/create-group', formData)
            setName('');
            setDescription('');
            for (const username of selected) {
                await axiosInstance.post('/chats/add/' + response.data.id.toString() + '/' + username)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.card_profile}>
            <form onSubmit={handleCreate} encType="multipart/form-data">
                <TextField
                    id="body"
                    label="Group"
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
                <TextField
                    id="desc"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
                <label htmlFor="users">Select Users:</label>
                <div id="users">
                    {friends.map((user) => (
                        <div className={styles.request_card} onClick={() => handleUserSelect(user.username)}>
                            <p>{user.username}</p>
                            <img className={styles.avatar} src={user.profile_picture} alt="friend_profile"/>
                        </div>
                    ))}
                </div>
                <Button type="submit" className={styles.button} variant="contained">
                    Create Group
                </Button>

            </form>
        </div>
    )

}

export default CreateGroup