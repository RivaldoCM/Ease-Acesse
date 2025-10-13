import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { IDecodedJWT } from '../../interfaces/IDecodedJWT';
import { signIn } from '../../services/apiManageONU/signIn';

import { Container } from './style';
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useResponse } from '../../hooks/useResponse';

export function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const {response, setFetchResponseMessage, severityStatus, responseMassage } = useResponse();

    const [email, setEmail] = useState('');
    const [password, setPassord] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target.value));
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassord((e.target.value));
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {event.preventDefault();};

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await signIn({email, password});
        console.log(response)
        if(response){
            if(response.success){
                localStorage.setItem('Authorization', response.responses.response.token);
                localStorage.setItem('Pages', JSON.stringify(response.responses.response.permissions));
                localStorage.setItem('initialPage', response.responses.response.initialPage)

                const jwtDecoded: IDecodedJWT = jwtDecode(response.responses.response.token);
                setUser({user: jwtDecoded});
                navigate('/');
            } else {
                setFetchResponseMessage(response.messages.message);
            }
        }
    }

    return (
        <Container className='flex'>
            <form className='flex' onSubmit={handleLogin}>
                <FormControl>
                    <InputLabel htmlFor="outlined-adornment-email">E-mail</InputLabel>
                    <OutlinedInput
                        placeholder='Digite seu E-mail'
                        type='text'
                        onChange={handleEmailChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <MailOutlineIcon />
                            </InputAdornment>
                        }
                        label="E-mail"
                    />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        placeholder='Digite sua senha'
                        type={showPassword ? 'text' : 'password'}
                        onChange={handlePasswordChange}
                        startAdornment={
                            <InputAdornment position="start">
                                    <LockOpenIcon />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <Button variant="contained" size="large" type="submit">
                    Entrar
                </Button>
            </form>
            {
                response ? 
                    <Alert severity={severityStatus} className="alert">{responseMassage}</Alert>
                : <></>
            }
        </Container>
    )
}