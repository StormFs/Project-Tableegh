import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./favicon.png";
import "./css/Header.css";
import user from "./user.png";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem('username');
        setUsername('');
        navigate('/');
    };

    const screenWidth = () => {
        const [width, setWidth] = useState(window.innerWidth);
        useEffect(() => {
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
        }, []);
        return width;
    }

    return (
        <header className={`header ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="header-container">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="Logo" />
                    </Link>
                </div>
                {screenWidth() < 800 ? (
                    <div className="user-menu">
                        <img 
                            src={user} 
                            alt="User" 
                            className="user-icon" 
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="dropdown-content">
                                <Link to="/" className="home-link" style={{color: "black"}}>Home</Link>
                                <Link to={`/profile/${username}`} className="profile-link" style={{color: "black"}}>Profile</Link>
                                <Link to="/quran" className="quran-link" style={{color: "black"}}>Quran</Link>
                                <Link to="/hadith" className="hadith-link" style={{color: "black"}}>Hadith</Link>
                                <Link to="/liked-verses" style={{color: "black"}}>Liked Verses</Link>
                                <Link to="/liked-hadith" style={{color: "black"}}>Liked Hadith</Link>
                                <Link to="/login" style={{color: "black"}} onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                ):(<>
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
                            <Link to="/login" style={{color: "black"}} onClick={handleLogout}>Logout</Link>
                        </div>
                    )}
                </div>
                </>)
                }
            </div>
        </header>
    );
}

export default Header;