import React from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import './css/Home.css';
import quran from './assets/quran1.png';
import hadith from './assets/hadith.jpeg';
import Footer from './Footer';  
import { Helmet } from 'react-helmet';
import RandomAyah from './RandomAyah';
import LoginPrompt from './loginprompt';
import RandomHadith from "./RandomHadith";

const Home = () => {
    const username = window.localStorage.getItem('username');
    const navigate = useNavigate();
    const handleQuran = () => {
        navigate('/quran');
    }
    const handleHadith = () => {
        navigate('/hadith');
    }
    return (
        <div className="home-container">
            <Helmet>
                <title>Tableegh - Home</title>
            </Helmet>
            <Header />
            {username ? (
                <div className="content" style={{ 
                    maxWidth: '1000px',
                    margin: '80px auto 0',
                    padding: '0 20px'
                }}>
                    <h1 style={{ 
                        textAlign: 'center',
                        color: '#333',
                        fontSize: '2rem',
                        marginBottom: '40px'
                    }}>Welcome, {username}</h1>
                    
                    <div className="section" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginBottom: '40px',
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <img src={quran} alt="Quran Book" style={{
                                width: '200px',
                                height: 'auto',
                                borderRadius: '4px'
                            }} />
                        </div>
                        <div>
                            <h2 style={{ 
                                textAlign: 'center',
                                color: '#333',
                                fontSize: '1.5rem',
                                marginBottom: '15px'
                            }}>The Quran</h2>
                            <p style={{ 
                                textAlign: 'center',
                                lineHeight: '1.6',
                                color: '#555',
                                marginBottom: '20px'
                            }}>
                                The holy book of Islam, providing guidance and wisdom for all aspects of life. Recite, reflect, and find peace in its verses.
                            </p>
                            <div style={{ textAlign: 'center' }}>
                                <button 
                                    onClick={handleQuran}
                                    style={{
                                        padding: '10px 25px',
                                        fontSize: '1rem',
                                        backgroundColor: '#4a6baf',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Read Quran
                                </button>
                            </div>
                        </div>  
                    </div>

                    <div className="section hadith" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginBottom: '40px',
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <img src={hadith} alt="Hadith Book" style={{
                                width: '200px',
                                height: 'auto',
                                borderRadius: '4px'
                            }} />
                        </div>
                        <div>
                            <h2 style={{ 
                                textAlign: 'center',
                                color: '#333',
                                fontSize: '1.5rem',
                                marginBottom: '15px'
                            }}>The Hadith</h2>
                            <p style={{ 
                                textAlign: 'center',
                                lineHeight: '1.6',
                                color: '#555',
                                marginBottom: '20px'
                            }}>
                                The teachings and practices of Prophet Muhammad (PBUH), offering practical guidance for daily life and spiritual growth.
                            </p>
                            <div style={{ textAlign: 'center' }}>
                                <button 
                                    onClick={handleHadith}
                                    style={{
                                        padding: '10px 25px',
                                        fontSize: '1rem',
                                        backgroundColor: '#4a6baf',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Read Hadith
                                </button>
                            </div>
                        </div>
                    </div>
                    <RandomAyah />
                    <RandomHadith />
                </div>
            ) : (
                <LoginPrompt />
            )}
            <Footer />
        </div>
    );
};

export default Home;