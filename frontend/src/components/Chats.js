import React, {useEffect, useState} from 'react'
import axiosInstance from "./axiosApi";
import Conversation from "./Conversation"
import "../../static/css/customStyles.css"
import styles from '../../static/css/component.module.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import ViewGroupDetails from "./ViewGroupDetails";
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInputGroup,
    MDBRow,
    MDBTypography
} from "mdb-react-ui-kit";
import {Create} from "@mui/icons-material";
import CreateGroup from "./CreateGroup";


const Chats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [viewMode, setViewMode] = useState("")
    useEffect( () => {
        fetchData()
    }, [])

    useEffect(() => {

    }, [selectedChat])


    const handleClickChat = (chat) => {
        setSelectedChat(chat)
        setViewMode('chat')

    }
    const handleViewGroup = (chat) => {
        setSelectedChat(chat)
        setViewMode('details')
    }
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/chats/')
            setChats(response.data)
        } catch (error) {
            console.error("in chats", error)
        }

    }
    return (
        <>
            <MDBContainer fluid className="py-5" style={{backgroundColor: "#A29057"}}>
                <MDBRow>
                    <MDBCol md="12">
                        <MDBCard id="chat3" style={{borderRadius: "15px"}}>
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                                        <div className="p-3">
                                            <MDBInputGroup className="rounded mb-3">
                                                <input
                                                    className="form-control rounded"
                                                    placeholder="Search"
                                                    type="search"
                                                />
                                                <span
                                                    className="input-group-text border-0"
                                                    id="search-addon"
                                                >
                                                <MDBIcon fas icon="search"/>
                                                </span>
                                                <CreateGroup/>
                                            </MDBInputGroup>
                                            <PerfectScrollbar style={{height: '400px'}}>
                                                <MDBTypography listUnStyled className="mb-0"
                                                               style={{paddingRight: '14px'}}>
                                                    {chats ? (
                                                        chats.map((chat, index) => (
                                                            <div className="p-2 border-bottom dots">
                                                                <div
                                                                    className="d-flex justify-content-between align-items-center"> {/* Modified class */}
                                                                    <div className="d-flex flex-row"
                                                                         onClick={() => handleClickChat(chat)}>
                                                                        <div>
                                                                            <img
                                                                                src={chat.image}
                                                                                alt="avatar"
                                                                                className="d-flex align-self-center me-3 avatar"
                                                                                width="60"
                                                                            />
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <p className="fw-bold mb-0">{chat.name}</p>
                                                                            <p className="small text-muted">{chat.description}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <i className="fas fa-ellipsis-vertical"
                                                                           onClick={() => handleViewGroup(chat)}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                           <div className="text-center">
                                                        <div className="spinner-border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                    )}
                                                </MDBTypography>
                                            </PerfectScrollbar>
                                        </div>
                                    </MDBCol>
                                    <MDBCol md="6" lg="7" xl="8">
                                        {viewMode === 'chat' && selectedChat && (
                                            <Conversation chat_id={selectedChat.id}/>
                                        )}
                                        {viewMode === 'details' && selectedChat && (
                                            <ViewGroupDetails group_ID={selectedChat.id} onleaveCallback={setChats} onrefreshCallback={setSelectedChat} old={chats} isPrivate={selectedChat.private}/>
                                        )}
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    )
}

export default Chats