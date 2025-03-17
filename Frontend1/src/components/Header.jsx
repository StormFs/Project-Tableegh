import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./favicon.png";
import "./css/Header.css";
import user from "./user.png";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="header">
            <div className="logo">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Logo" />
                    <h4>TABLEEGH</h4>
                </Link>
            </div>
            <div className="nav-container">
                <Link to="/" className="home-link">Home</Link>
                <Link to="/quran" className="quran-link">Quran</Link>
                <Link to="/hadith" className="hadith-link">Hadith</Link>
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
                        <Link to="/liked-hadith">Liked Hadith</Link>
                        <Link to="/liked-verses">Liked Verses</Link>
                        <Link to="/login">Logout</Link>
                    </div>
                )}
            </div>
        </div>  
    );
}

export default Header;