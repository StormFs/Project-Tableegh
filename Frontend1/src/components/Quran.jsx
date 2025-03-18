import React from 'react';
import './css/Quran.css';
import Header from './Header';
import { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import {Helmet} from 'react-helmet';

const Quran =   () => {
    const [likedSurahs, setLikedSurahs] = useState(new Set());
    const username = window.localStorage.getItem('username');
    const [surah, setSurah] = useState([]);
    
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
            <div className="quran-container" style={{ marginTop: '100px' }}>
                <h1 className='text-center' style={{ fontSize: '40px', fontWeight: 'bold' }}>القرآن الكريم</h1>
                <div className="surah-list" style={{ marginTop: '25px' }}>   
                    {surah.map(surah => (
                        <div key={surah.surah_number} className='container' onClick={() => navigate(`/quran/${surah.surah_number}`)} style={{ textAlign: 'right', flexDirection: 'column', flexGrow: 1, cursor:'pointer'}}>
                            <div className="surah-container">
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
                        </div>
                    ))}
                </div>
            </div>
            ) : (
                <div>
                    <h1 style={{ textAlign: 'center' }} >Please login to continue</h1>
                    <button style={{ marginTop: '20px', marginLeft: '45%' }} class="btn btn-outline-secondary" onClick={() => navigate('/login')}>Login</button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Quran;
