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


const RegisterUser = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRePassword = () => setShowRePassword((show) => !show);

    const handleSubmit = (e) => {
        e.preventDefault();
        const csrftoken = getCookie('csrftoken');
        console.log(JSON.stringify({email, username, password, password2}))
        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({email, username, password, password2}),
        })
            .then((response) => response.json())
            .catch((error)=> {
            console.error('Registration failed!', error);
        });

    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handlePassword2Change = (e) => {
        setPassword2(e.target.value)
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
        <Grid container rowSpacing={2} alignItems="center">
            <Grid item xs={12} sm={6} className={styles.container_right}>
                <Typography component='h4' variant='h4'>
                    Register
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Grid container spacing={2} alighItems="center" justifyContent="space-evenly" className={styles.container_register}>
                    <Grid item xs={12}>
                        <FormControl>
                            <TextField
                                id="email"
                                label="Email"
                                variant='outlined'
                                required
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <TextField
                                className={styles.register_field}
                                id="username"
                                value={username}
                                variant='outlined'
                                required
                                label='Username'
                                defaultValue=""
                                onChange={handleUsernameChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                            <OutlinedInput
                                onChange={handlePasswordChange}
                                id="password"
                                value={password}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                required = {true}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Retype Password *</InputLabel>
                            <OutlinedInput
                                onChange={handlePassword2Change}
                                id="repassword"
                                value={password2}
                                type={showRePassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowRePassword}
                                            edge="end"
                                        >
                                            {showRePassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                required = {true}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                          <Button variant="contained" onClick={handleSubmit}>Sign Up</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    )
}
export default RegisterUser