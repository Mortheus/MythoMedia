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
import {useParams} from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const {uidb64, token} = useParams()
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        console.log(uidb64, token)
        console.log(password, password2)
        try {
            const csrftoken = getCookie('csrftoken');
            fetch('http://127.0.0.1:8000/api/reset-password-email/' + uidb64.toString() + "/" + token.toString() + "/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({password, password2}),
            })
                .then((response) => console.log(response))
                .catch((error) => {
                    console.error('Reset failed', error);
                });
            navigate('/login')
        } catch (error) {
            throw error;
        }
    };

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
                        <span className='h3 fw-bold mb-0'>Inscribe a password worthy of the mystic powers of Hecate. Let it be a key that unlocks the hidden realms of your online existence</span>
                    </div>
                    <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
                        {/*<h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3>*/}
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            label="Password *"
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <MDBInput
                            wrapperClass='mb-4 mx-5 w-100'
                            onChange={(e) => setPassword2(e.target.value)}
                            id="password2"
                            value={password2}
                            type={showPassword ? 'text' : 'password'}
                            label="Retype Password *"
                            required={true}
                        />
                        <MDBBtn className="mb-4 px-5 mx-5 w-100 custom-rounded gold" size='lg'
                                onClick={handleResetPassword}>Reset</MDBBtn>
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
        </MDBContainer>
    )
}

export default ResetPassword;