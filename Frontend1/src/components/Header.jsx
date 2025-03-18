import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./favicon.png";
import "./css/Header.css";
import user from "./user.png";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const username = localStorage.getItem('username');
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="header">
            <div className="logo">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Logo" />
                    <h4 style={{color: "black",}}>TABLEEGH</h4>
                </Link>
            </div>
            <div className="nav-container">
                <Link to="/" className="home-link" style={{color: "black"}}>Home</Link>
                <Link to="/quran" className="quran-link" style={{color: "black"}}>Quran</Link>
                <Link to="/hadith" className="hadith-link" style={{color: "black"}}>Hadith</Link>
            </div>
            <div className="user-menu">
                <img 
                    src={user} 
                    alt="User" 
                    className="user-icon" 
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="dropdown-content">
                        <Link to={`/profile/${username}`} className="profile-link" style={{color: "black"}}>Profile</Link>
                        <Link to="/liked-hadith" style={{color: "black"}}>Liked Hadith</Link>
                        <Link to="/liked-verses" style={{color: "black"}}>Liked Verses</Link>
                        <Link to="/login" style={{color: "black"}} onClick={() => {
                            localStorage.removeItem('username');
                            window.location.href = '/login';
                        }}>Logout</Link>
                    </div>
                )}
            </div>
        </div>  
    );
}

export default Header;