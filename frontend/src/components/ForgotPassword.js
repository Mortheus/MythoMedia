import React, {useState} from 'react';
import {MDBBtn, MDBContainer, MDBRow, MDBCol, MDBIcon, MDBInput} from 'mdb-react-ui-kit';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {Button, Grid, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {decodeToken} from 'react-jwt';
import styles from '../../static/css/component.module.css';
import axiosInstance from './axiosApi';
import '@fortawesome/fontawesome-free/css/all.min.css'
import BackgroundIMG from '../../static/images/Mt._olympus1_CC.png'
import "../../static/css/customStyles.css"
import {toast, ToastContainer} from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const initiate = true

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const csrftoken = getCookie('csrftoken');
            fetch('http://127.0.0.1:8000/api/initiate-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({email, initiate}),
            })
                .then((response) => {
                    toast.info('🕊️👟The messenger of the gods awaits you in your inbox. Unveil the wisdom it holds!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    })
                })
                .catch((error) => {
                    console.error('Reset failed', error);
                });
        } catch (error) {
        throw error;}
    }

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        return (
            <MDBContainer fluid style={{minHeight: '50vh', overflow: 'hidden'}}>
                <MDBRow>
                    <MDBCol sm="6">
                        <div className='d-flex flex-row ps-3 pt-5 pb-5 pl-3 text-center justify-content-center'>
                            <MDBIcon fas icon="bolt" size="3x"/>
                            <span className='h1 fw-bold mb-0'>MythoMedia</span>
                            <MDBIcon fas icon="bolt" size="3x"/>
                        </div>
                        <div className='d-flex flex-row ps-3 pt-5 pb-5 pl-3 text-center justify-content-center'>
                            <span className='h3 fw-bold mb-0'>Let the gentle touch of Hypnos help you regain access through your email</span>
                        </div>
                        <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
                            {/*<h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3>*/}
                            <MDBInput
                                wrapperClass='mb-4 mx-5 w-100'
                                label="Email *"
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <MDBBtn className="mb-4 px-5 mx-5 w-100 custom-rounded gold" size='lg'
                                    onClick={handleForgotPassword}>Send</MDBBtn>
                        </div>
                    </MDBCol>
                    <MDBCol sm='6' className='d-none d-sm-block px-0'>
                        <img
                            src={BackgroundIMG}
                            alt="Login image"
                            className="w-100"
                            style={{objectPosition: 'left', objectFit: 'cover'}}
                        />
                    </MDBCol>
                </MDBRow>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover={false}
                    theme="light"
                />
            </MDBContainer>
        )
    }

    export default ForgotPassword;