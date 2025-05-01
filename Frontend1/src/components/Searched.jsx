import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Helmet } from 'react-helmet';
import './css/Surah.css';
import './css/SharedAnimations.css';
import { right } from '@popperjs/core';

const Searched = () => {
    const navigate = useNavigate();
    const { search } = useParams();
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(22);
    const [likedVerses, setLikedVerses] = useState(new Set());
    const username = window.localStorage.getItem('username');

    useEffect(() => {
        const fetchVerses = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/search/${search}`);
                setVerses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching verses:', error);
                setError(error);
                setLoading(false);
            }
        };
        fetchVerses();
    }, [search]);

    const getlikes = async () => {
        try {
            const response = await axios.get(`http://localhost:5143/api/likes/get/${username}`);
            if (Array.isArray(response.data)) {
                const likedVerseNumbers = response.data.map(like => like.verse_number);
                setLikedVerses(new Set(likedVerseNumbers));
            } else {
                console.error('Unexpected data format:', response.data);
                setLikedVerses(new Set());
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    useEffect(() => {
        if (username) {
            getlikes();
        }
    }, [username]);

    const toggleLike = (verseNumber, surahNumber) => {
        if (!username) {
            alert('Please login to continue');
            return;
        }
        handleLike(verseNumber, surahNumber);
        setLikedVerses((prevLikedVerses) => {
            const updatedLikedVerses = new Set(prevLikedVerses);
            if (updatedLikedVerses.has(verseNumber)) {
                updatedLikedVerses.delete(verseNumber);
            } else {
                updatedLikedVerses.add(verseNumber);
            }
            return updatedLikedVerses;
        });
    };

    const handleLike = async (verseNumber, surahNumber) => {
        try {
            const response = await axios.post(`http://localhost:5143/api/likes/add`, {
                username: username,
                verse_number: verseNumber,
                surah_number: surahNumber
            });
            console.log('Like added:', response.data);
        } catch (error) {
            console.error('Error adding like:', error);
        }
    };

    return (
        <div className="surah-page-container fade-in">
            <Helmet>
                <title>Tableegh - Search Results for "{search}"</title>
            </Helmet>
            <Header />
            {username ? (
                <div style={{ marginTop: '100px', padding: '0 20px', maxWidth: '1200px', margin: '100px auto 0' }}>
                    {loading && (
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    )}
                    <div className="surah-content">
                        <h1 className="surah-title" style={{ 
                            textAlign: 'center', 
                            marginBottom: '30px',
                            color: '#2c3e50',
                            fontSize: '2.5rem'
                        }}>Search Results for "{search}"</h1>
                        <p className="surah-verses" style={{ 
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            color: '#666',
                            marginBottom: '40px'
                        }}>Found {verses.length} verses</p>
                        <div className="verses-container" style={{ 
                            maxWidth: '800px',
                            margin: '0 auto',
                            padding: '20px'
                        }}>
                            {verses.map((verse, index) => (
                                <div 
                                    key={verse.verse_number + '-' + verse.surah_number} 
                                    className="verse-container"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        padding: '25px',
                                        marginBottom: '30px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <bdi style={{
                                            fontSize: '1.1rem',
                                            color: '#2c3e50',
                                            fontWeight: '500'
                                        }}>({verse.surah_name_arabic} : {verse.verse_number})</bdi>
                                        <button 
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '5px'
                                            }} 
                                            onClick={() => toggleLike(verse.verse_number, verse.surah_number)}
                                        >
                                            {likedVerses.has(verse.verse_number) ? 
                                                <FaHeart style={{color: 'red'}} size={25} /> : 
                                                <FaRegHeart size={25} />
                                            }
                                        </button>
                                    </div>

                                    <div style={{ 
                                        marginBottom: '20px',
                                        textAlign: 'right',
                                        direction: 'rtl'
                                    }}>
                                        <bdi className="verse-number" style={{ 
                                            fontSize: `${fontSize}px`,
                                            fontFamily: 'Al Qalam Indopak Arabic Font',
                                            lineHeight: '1.8'
                                        }}>
                                            {verse.arabic}
                                        </bdi>
                                    </div>

                                    <p style={{ 
                                        fontSize: `${fontSize}px`,
                                        lineHeight: '1.6',
                                        color: '#333',
                                        marginBottom: '20px'
                                    }} dangerouslySetInnerHTML={{
                                        __html: verse.english.replace(
                                            new RegExp(search, 'gi'),
                                            `<mark class="highlight">${search}</mark>`
                                        )
                                    }}></p>

                                    <button 
                                        onClick={() => navigate(`/quran/${verse.surah_number[0]}`)}
                                        style={{
                                            backgroundColor: '#2c3e50',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#34495e'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
                                    >
                                        Go to Surah
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <LoginPrompt />
            )}
            <Footer />
        </div>
    );
};

export default Searched;
