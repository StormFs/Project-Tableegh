import React, { useState, useEffect } from 'react';
import './css/Quran.css';
import './css/SharedAnimations.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { Switch } from '@mui/material';
import axios from 'axios';
import Footer from './Footer';
import SearchBar from './SearchBar';


const Quran = () => {
    const [likedSurahs, setLikedSurahs] = useState(new Set());
    const username = window.localStorage.getItem('username');
    const [surah, setSurah] = useState([]);
    const [toggle, setToggle] = useState(false);
    
    const getlikes = async () => {
        try {
            const response = await axios.get(`http://localhost:5143/api/likes/getsurah/${username}`);
            if (Array.isArray(response.data)) {
                const likedSurahNumbers = response.data.map(like => like.surah_number);
                setLikedSurahs(new Set(likedSurahNumbers));
            } else {
                console.error('Unexpected data format:', response.data);
                setLikedSurahs(new Set());
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };
    
    useEffect(() => {
        getlikes();
    }, [username]);

    const toggleLike = (surahNumber) => {
        if (!username) {
            alert('Please login to continue');
            return;
        }
        handleLike(surahNumber);
        setLikedSurahs((prevLikedSurahs) => {
            const updatedLikedSurahs = new Set(prevLikedSurahs);
            if (updatedLikedSurahs.has(surahNumber)) {
                updatedLikedSurahs.delete(surahNumber);
            } else {
                updatedLikedSurahs.add(surahNumber);
            }    
            return updatedLikedSurahs;
        });
    };

    const handleLike = async (surahNumber) => {
        try {
            const response = await axios.post(`http://localhost:5143/api/likes/addsurah`, {
                username: username,
                surah_number: surahNumber
            });

        } catch (error) {
            console.error('Error adding like:', error);
        }
    };
    
    const handletoggle = () => {
        setToggle((prevToggle) => {
            return !prevToggle;
        });
    };

    useEffect(() => {
        const fetchSurah = async () => {
            try {
                const response = await axios.get('http://localhost:5143/api/surah');
                setSurah(response.data);
            } catch (error) {
                console.error('Error fetching surah:', error);
            }
        };  
        fetchSurah();
    }, []);

    const navigate = useNavigate();

    return (
        <div>
            <Helmet>
                <title>Tableegh - Quran</title>
            </Helmet>
            <Header />
            {username ? (
                
                <div className="quran-container fade-in">
                    <div className="search-container">
                        <SearchBar />
                    </div>
                    <h1 className="quran-title">القرآن الكريم</h1>
                    <hr />
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', marginTop: '40px'}}>
                        <Switch defaultChecked={toggle} onChange={()=> handletoggle() } />
                        <label style={{textAlign: 'center'}}>Liked Surahs</label>
                    </div>
                    {toggle ? (
                        <div>
                            <h1 style={{textAlign: 'center', marginBottom: '2rem'}}>Liked Surahs</h1>
                            {surah.map((surah, index) => (
                                likedSurahs.has(surah.surah_number) ? (
                                <div 
                                    key={surah.surah_number} 
                                    className="surah-container"
                                    style={{animationDelay: `${index * 0.1}s`}}
                                    onClick={() => navigate(`/quran/${surah.surah_number}`)}
                                >
                                    <div className="surah-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <button
                                            style={{ backgroundColor: 'transparent', border: 'none', marginRight: '10px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(surah.surah_number);
                                            }}
                                        >
                                            {likedSurahs.has(surah.surah_number) ? (
                                                <FaHeart style={{ color: 'red' }} size={30} />
                                            ) : (
                                                <FaRegHeart size={30} />
                                            )}
                                        </button>
                                        <bdi className="surah-number-name h3">{surah.surah_number} - {surah.surah_name_arabic} </bdi>
                                    </div>
                                    <hr />
                                    <div className="surah-details h3" style={{ textAlign: 'right' }}>
                                        <span className="surah-english-name" >{surah.surah_name_english}</span>
                                        <p className="surah-verses" style={{ marginTop: '30px' }}>Verses = {surah.verses_amount}</p>
                                    </div>
                                </div>
                                ):(<></>)
                            ))}
                        </div>
                    ) : (
                    <div className="surah-list">   
                        {surah.map((surah, index) => (
                            <div 
                                key={surah.surah_number} 
                                className="surah-container"
                                style={{animationDelay: `${index * 0.1}s`}}
                                onClick={() => navigate(`/quran/${surah.surah_number}`)}
                            >
                                <div className="surah-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <bdi className="surah-number-name h3">{surah.surah_number} - {surah.surah_name_arabic} </bdi>
                                    <button
                                        style={{ backgroundColor: 'transparent', border: 'none', marginRight: '10px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(surah.surah_number);
                                        }}
                                    >
                                        {likedSurahs.has(surah.surah_number) ? (
                                            <FaHeart style={{ color: 'red' }} size={30} />
                                        ) : (
                                            <FaRegHeart size={30} />
                                        )}
                                    </button>
                                </div>
                                <hr />
                                <div className="surah-details h3" style={{ textAlign: 'right' }}>
                                    <span className="surah-english-name" >{surah.surah_name_english}</span>
                                    <p className="surah-verses" style={{ marginTop: '30px' }}>Verses = {surah.verses_amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            ) : (
                <div className="login-prompt" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <h1>Please login to continue</h1>
                    <button
                        className="login-button"
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Quran;
