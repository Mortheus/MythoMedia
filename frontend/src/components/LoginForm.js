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
import axiosInstance from "./axiosApi"
import {decodeToken} from "react-jwt";
// import jwt from 'jsonwebtoken';

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/loggin', {
                email: email,
                password: password
            });
            console.log(response.data);
            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            sessionStorage.setItem('access_token', response.data.access);
            sessionStorage.setItem('refresh_token', response.data.refresh);
            const user_ID = await decodeToken(sessionStorage.getItem('access_token'))['user_id'];
            sessionStorage.setItem('user_id', user_ID);
            navigate('/homepage')

        } catch (error) {
            throw error;
        }
    }
    return (
        <>
            <Grid container alignItems="center">
                <Grid item xs={12} sm={6} className={styles.container_fields}>
                    <Grid item xs={12} sm={6}>
                        <h2 className={styles.form_title}>
                            Log In
                        </h2>
                    </Grid>
                    <Grid item xs={12} justifyContent="center" alignItems="center">
                        <FormControl className={styles.form_field}>
                            <TextField
                                id="email"
                                label="Email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autocomplete='off'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={styles.form_field}>
                            <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                            <OutlinedInput
                                onChange={e => setPassword(e.target.value)}
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
                                required={true}
                                autocomplete='off'
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleLogIn}>Log In</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={2} alighItems="center" justifyContent="space-evenly">
                        <p>Image here + text</p>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default LoginForm