import React from 'react'
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import {useState} from "react";
import {Visibility} from "@mui/icons-material";
import {VisibilityOff} from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useNavigate} from "react-router-dom";
import {IconButton, InputAdornment} from "@mui/material";
import {InputLabel, OutlinedInput} from "@mui/material";
import styles from "../../static/css/component.module.css";
import {MDBBtn, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow} from "mdb-react-ui-kit";
import BackgroundIMG from "../../static/images/Mt._olympus1_CC.png";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const RegisterUser = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        const csrftoken = getCookie('csrftoken');
        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({email, username, password, password2}),
        })
            .then((response) => {
                if (response.ok) {
                    toast.info('🏛 Success! Check your email!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        theme: 'light',
                    });
                } else {
                    return response.json().then((errorData) => {
                        Object.entries(errorData).forEach(([key, value]) => {
                            if (key === 'email') {
                                value.forEach((error) => {
                                    toast.error('Email: ' + error);
                                });
                            }
                            if (key === 'username') {
                                value.forEach((error) => {
                                    toast.error('Username: ' + error);
                                });
                            }
                            if (key === 'password') {
                                value.forEach((error) => {
                                    toast.error('Password: ' + error);
                                });
                            }
                            if (key === 'password2') {
                                value.forEach((error) => {
                                    toast.error('Retype Password: ' + error);
                                });
                            }
                            if (key === 'password_error') {
                                value.forEach((error) => {
                                    toast.error('Retype Password: ' + error);
                                });
                            }
                        });
                    });
                }
            })
            .catch((error) => {
                console.error('Registration failed', error);
                toast.error('Registration failed');
            });
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
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
                <MDBCol sm="6" className="p-0">
                    <img
                        src={BackgroundIMG}
                        alt="Login image"
                        className="w-100"
                        style={{objectPosition: 'right', objectFit: 'cover'}}
                    />
                </MDBCol>
                <MDBCol sm='6' className='d-none d-sm-block px-0'>
                    <div className='d-flex flex-row ps-3 pt-5 pb-5 pl-3 text-center justify-content-center'>
                        <MDBIcon fas icon="bolt" size="3x"/>
                        <span className='h1 fw-bold mb-0'>MythoMedia</span>
                        <MDBIcon fas icon="bolt" size="3x"/>
                    </div>
                    <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            label="Email *"
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            id="username"
                            value={username}
                            variant='outlined'
                            required
                            label='Username'
                            defaultValue=""
                            onChange={handleUsernameChange}/>
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            value={password}
                            type={showPassword ? 'text' : 'password'}
                            label="Password *"
                            required={true}
                        />
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            onChange={(e) => setPassword2(e.target.value)}
                            id="password2"
                            value={password2}
                            type={showPassword ? 'text' : 'password'}
                            label="Password *"
                            required={true}
                        />
                        <button className="mb-4 px-5 mx-5 w-100 custom-rounded gold" size='lg'
                                onClick={handleSubmit}>Register
                        </button>
                        <div className="ms-5 pl-3 text-center">
                            <div>Already have an account?</div>
                            <div>
                                <a href="/login" className="gold_link">Login here</a>
                            </div>
                        </div>
                    </div>
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
export default RegisterUser