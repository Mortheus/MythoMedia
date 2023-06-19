import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import Message from "./Message";
import Scroll from "./Scroll";
import {MDBCol, MDBIcon} from "mdb-react-ui-kit";
import "../../static/css/customStyles.css"
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {useAuth} from "./AuthContext";


const Conversation = ({chat_id}) => {
    const [messages, setMessages] = useState([]);
    const [body, setBody] = useState("")
    const {loggedUser} = useAuth()
    const fetchData = async () => {
        try {
            return await axiosInstance.get('/chats/conversation-history/' + chat_id.toString());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchChatData = async () => {
            const response = await fetchData();
            setMessages(response.data);
        };
        fetchChatData();
    }, [chat_id]);

    useEffect(() => {
        fetchData()
    }, [messages])

    const profile_picture = sessionStorage.getItem('profile_pic')

    const handleSend = async () => {
        try {
            const response = await axiosInstance.post('chats/add-message/' + chat_id.toString(), {
                'body': body
            })
            setMessages([...messages, response.data])
            setBody("")
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
                <PerfectScrollbar style={{height: '400px'}}>
                    {messages.map((message, index) => (
                        <Message message={message}/>
                    ))
                    }
                </PerfectScrollbar>
            <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                <img className="avatar"
                     src={loggedUser.profile_picture}
                     alt="avatar 3"
                     style={{width: "40px", height: "100%", borderRadius: '50%'}}
                />
                <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleFormControlInput2"
                    placeholder="Type message"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <a className="ms-1 text-muted" href="#!">
                    <MDBIcon fas icon="paperclip"/>
                </a>
                <a className="ms-3 text-muted" href="#!">
                    <MDBIcon fas icon="smile"/>
                </a>
                <Button className="ms-3" onClick={handleSend}><MDBIcon fas icon="paper-plane"/></Button>
            </div>
        </>
    )
}

export default Conversation