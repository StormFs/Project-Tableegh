import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Helmet } from 'react-helmet';

const Profile = () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/login';
    }
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    
    return (
        <div>
            <Header />
            <Helmet>
                <title>Profile | {username}</title>
            </Helmet>
            <h1 style={{color: "black",marginTop: "100px", textAlign: "center"}} >Profile {username}</h1>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <button style={{color: "black", textAlign: "center"}} onClick={() => {
                    localStorage.removeItem('username');
                    window.location.href = '/login';
                }}>Logout</button>
            </div>
        </div>
    )
}

export default Profile;
