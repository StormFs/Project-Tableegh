<script src="http://localhost:8097"></script>
import React, { useState, useEffect } from 'react';
import './css/Login.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from './UserContext';

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');

    const [loginResponse, setLoginResponse] = useState(null);
    const [signupResponse, setSignupResponse] = useState(null);

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameExistsError, setUsernameExistsError] = useState('');
    const [emailExistsError, setEmailExistsError] = useState('');

    const loginUrl = 'http://localhost:5143/api/login';
    const signupUrl = 'http://localhost:5143/api/signup';
    const { setUsername: setGlobalUsername } = useUser();

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(loginUrl, {
                username: username, 
                password: password
            });
            setLoginResponse(response.data);
            if (response.data && response.data.success) {
                setGlobalUsername(username);
                window.localStorage.setItem('username', username);
                navigate('/');
            } else {
                if (response.data && response.data.message.includes('username')) {
                    setUsernameError(response.data.message);
                }
                if (response.data && response.data.message.includes('password')) {
                    setPasswordError(response.data.message);
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(signupUrl, {
                username: signupUsername,
                password: signupPassword,
                email: signupEmail
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            

            
            setSignupResponse(response.data);
            console.log(response.data);
            console.log(response.data.message);
            if (response.data && response.data.message.includes('success')) {
                setIsSignup(false);
                setUsername(signupUsername);
                setPassword(signupPassword);
                navigate('/login');
                setSignupUsername('');
                setSignupPassword('');
                setSignupEmail('');                
            } else {
                setUsernameExistsError('');
                setEmailExistsError('');
                if (response.data && response.data.message.includes('Username')) {
                    setUsernameExistsError("Username already exists");
                }
                if (response.data && response.data.message.includes('Email')) {
                    setEmailExistsError("Email already exists");
                }
                if (response.data && response.data.message.includes('required')) {
                    setUsernameExistsError("Username is required");
                    setEmailExistsError("Email is required");
                    setPasswordError("Password is required");
                }
            }
        } catch (error) {
            console.error('Signup failed:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
            setSignupUsername('');
            setSignupPassword('');
            setSignupEmail('');
            setUsernameExistsError('');
            setEmailExistsError('');
            setIsSignup(false);
        } else {
            await handleLogin();
        }
    };

    const handleSignuppage = async (e) => {
        e.preventDefault();
        if (isSignup) {
            await handleSignup();
            console.log(signupResponse);
            if (signupResponse.data && signupResponse.data.message.includes('success')) {
                setIsSignup(false);
                navigate('/login');
                setSignupUsername('');
                setSignupPassword('');
                setSignupEmail('');
                setEmailExistsError('');
                setUsernameExistsError('');
            }
            
        } else {
            setUsername('');
            setPassword('');
            setUsernameError('');
            setPasswordError('');
            setIsSignup(true);
        }
    };


    return (
        <div className='body'>
        <head>
            {isSignup ? <title>Tableegh | Signup</title> : <title>Tableegh | Login</title>}
        </head>
            <div className="signup-container">
                <h2>Allah hu Akbar</h2>
                
                {isSignup ? (
                <form action="/signup" method="post">
                    <label htmlFor="username">Username</label>
                    <input autoComplete='username' type="text" id="username" name="username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} placeholder='Enter your username' required />
                    {usernameExistsError && <div className="error" style={{color: 'red', paddingBottom: '20px'}}>{usernameExistsError}</div>}
                    <label htmlFor="password">Password</label>
                    <input autoComplete='current-password' type="password" id="password" name="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder='Enter your password' required />
                    {passwordError && <div className="error" style={{color: 'red', paddingBottom: '20px'}}>{passwordError}</div>}
                    <label htmlFor="email">Email</label>
                    <input autoComplete='email' type="email" id="email" name="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder='Enter your email' required />
                    {emailExistsError && <div className="error" style={{color: 'red', paddingBottom: '20px'}}>{emailExistsError}</div>}
                </form>
                ) : (
                <form action="/login" method="post">
                    <label htmlFor="username">Username</label>
                    <input autoComplete='username' type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your username' required />
                    <label htmlFor="password">  Password</label>
                    <input autoComplete='current-password' type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' required />
                    {passwordError && <div className="error" style={{color: 'red', paddingBottom: '20px'}}>{passwordError}</div>}
                </form>
                )}
                <div className="button-container">
                    <Button variant="primary" type="submit" className='mx-2' onClick={handleSignuppage}>Sign Up</Button>
                    <Button variant="dark" type="submit" className='mx-2' onClick={handleSubmit}>Login</Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
