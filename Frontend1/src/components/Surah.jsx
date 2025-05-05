import React from 'react';
import Header from './Header';
import { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useEffect} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './css/Surah.css';
import './css/SharedAnimations.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Helmet } from 'react-helmet';

const Surah = () => {
    const { surah_number } = useParams();
    const location = useLocation();
    const [surah, setSurah] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(22);
    const [name, setName] = useState('');
    const [likedVerses, setLikedVerses] = useState(new Set());
    const username = window.localStorage.getItem('username');

    useEffect(() => {
        const fetchSurah = async () => {
            try {
                const response = await axios.get(`http://localhost:5143/api/surah/get/${surah_number}`);
                const surahname = await axios.get(`http://localhost:5143/api/surah/get/name/${surah_number}`);
                setName(surahname.data.name);
                setSurah(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurah();
    }, [surah_number]);

    useEffect(() => {
        if (!loading && surah.length > 0) {
            const params = new URLSearchParams(location.search);
            const verseNumber = params.get('verse');
            if (verseNumber) {
                setTimeout(() => {
                    const verseElement = document.getElementById(`verse-${verseNumber}`);
                    if (verseElement) {
                        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        verseElement.style.backgroundColor = '#f0f2f5';
                        setTimeout(() => {
                            verseElement.style.backgroundColor = 'transparent';
                        }, 2000);
                    }
                }, 100);
            }
        }
    }, [loading, surah, location.search]);

    const getlikes = async () => {
        try {
            const response = await axios.get(`http://localhost:5143/api/likes/get/${username}`);
            console.log('Likes API Response:', response.data);
            if (Array.isArray(response.data)) {
                const likedVersesSet = new Set(response.data.map(like => `${like.surah_number}:${like.verse_number}`));
                console.log('Processed Likes Set:', Array.from(likedVersesSet));
                setLikedVerses(likedVersesSet);
            } else {
                console.error('Unexpected data format:', response.data);
                setLikedVerses(new Set());
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
            setLikedVerses(new Set());
        }
    };

    useEffect(() => {
        console.log('Component mounted/updated, username:', username, 'surah_number:', surah_number);
        if (username) {
            getlikes();
        }
    }, [username, surah_number]);

    const toggleLike = (verseNumber) => {
        if (!username) {
            alert('Please login to continue');
            return;
        }
        handleLike(verseNumber);
        setLikedVerses((prevLikedVerses) => {
            const updatedLikedVerses = new Set(prevLikedVerses);
            const verseKey = `${surah_number}:${verseNumber}`;
            console.log('Toggling like for verse:', verseKey);
            if (updatedLikedVerses.has(verseKey)) {
                updatedLikedVerses.delete(verseKey);
            } else {
                updatedLikedVerses.add(verseKey);
            }
            console.log('Updated likes set:', Array.from(updatedLikedVerses));
            return updatedLikedVerses;
        });
    };
    const handleLike = async (verseNumber) => {
        try {
            const response = await axios.post(`http://localhost:5143/api/likes/add`, {
                username: username,
                verse_number: verseNumber,
                surah_number: surah_number
            });
            console.log('Like added:', response.data);
        } catch (error) {
            console.error('Error adding like:', error);
        }
    };
    return (
        <div className="surah-page-container fade-in">
            <Helmet>
                <title>Tableegh - Surah {surah_number}</title>
            </Helmet>
            <Header />
            {username ? (
                <div style={{ marginTop: '100px' }}>
                    {loading && (
                    <div className="loading-container">
                        <div className="loader"></div>
                    </div>
                )}
                <div className="surah-content">
                    <h1 className="surah-title">{name}</h1>
                    <hr />
                    <div className="verses-container">
                        {surah.map((verse, index) => (
                            <div 
                                key={verse.verse_number} 
                                id={`verse-${verse.verse_number}`}
                                className="verse-container"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    transition: 'background-color 0.5s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <button style={{backgroundColor: 'transparent', border: 'none', marginRight: '10px'}} onClick={() => toggleLike(verse.verse_number)}>
                                        {likedVerses.has(`${surah_number}:${verse.verse_number}`) ? <FaHeart style={{color: 'red'}} size={30} /> : <FaRegHeart size={30} />}
                                    </button>
                                    <bdi className="verse-number" style={{ fontSize: `${fontSize}px`, display: 'flex', alignItems: 'center', fontFamily: 'Al Qalam Indopak Arabic Font' }}>
                                        {verse.verse_number} - {verse.arabic} 
                                    </bdi>
                                </div>
                                <hr />
                                <p style={{ fontSize: `${fontSize}px`, marginTop: '20px', textAlign: 'left' }}>{verse.english}</p>
                                <br />
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

export default Surah;


