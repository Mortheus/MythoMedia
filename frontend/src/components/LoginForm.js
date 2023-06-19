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
import {useAuth} from "./AuthContext";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {setAuth} = useAuth();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/loggin', {
                email: email,
                password: password
            });
            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
            sessionStorage.setItem('access_token', response.data.access);
            sessionStorage.setItem('refresh_token', response.data.refresh);
            const user_ID = await decodeToken(sessionStorage.getItem('access_token'))['user_id'];
            sessionStorage.setItem('user_id', user_ID);
            setAuth(true);
            navigate('/feed');
        } catch (error) {
            toast.error('⚡ The gates of Olympus remain closed, for your credentials are amiss! ⚡', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <MDBContainer fluid style={{minHeight: '50vh', overflow: 'hidden'}}>
            <MDBRow>
                <MDBCol sm="6">
                    <div className='d-flex flex-row ps-3 pt-5 pb-5 pl-3 text-center justify-content-center'>
                        <MDBIcon fas icon="bolt" size="3x"/>
                        <span className='h1 fw-bold mb-0'>MythoMedia</span>
                        <MDBIcon fas icon="bolt" size="3x"/>
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
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            value={password}
                            type={showPassword ? 'text' : 'password'}
                            label="Password *"
                            required={true}
                        />
                        <button className="mb-4 px-5 mx-5 w-100 custom-rounded gold" size='lg'
                                onClick={handleLogIn}>Login
                        </button>
                        <div className='text-center mx-5'
                             style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
                            <p className="small mb-3 pb-lg-3 mx-5"><a className="text-muted" href="/forgot-password">Forgot
                                password?</a>
                            </p>
                            <p className='ms-5 pl-3'>Don't have an account? <a href="/register" className="gold_link">Register
                                here</a></p>
                        </div>
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

export default LoginForm;