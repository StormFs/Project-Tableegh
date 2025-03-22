import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';  
import { Helmet } from 'react-helmet';
import './css/SharedAnimations.css';
import './css/LikedHadith.css';

const LikedHadiths = () => {
    const [likedHadiths, setLikedHadiths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedHadiths = async () => {
            if (!username) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5143/api/liked-hadith/${username}`);
                if (response.data && Array.isArray(response.data)) {
                    setLikedHadiths(response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching liked hadiths:', err);
                setError('Failed to load your liked hadiths. Please try again later.');
                setLoading(false);
            }
        };
        fetchLikedHadiths();
    }, [username, navigate]);

    const handleUnlike = async (book_id, hadith_id) => {
        try {
            await axios.delete(`http://localhost:5143/api/liked-hadiths/${username}/${book_id}/${hadith_id}`);
            setLikedHadiths(prevLikedHadiths => 
                prevLikedHadiths.filter(hadith => 
                    !(hadith.hadith_id === hadith_id && hadith.book_id === book_id)
                )
            );
        } catch (err) {
            console.error('Error unliking hadith:', err);
        }
    };
    
    const navigateToChapter = (book_id, chapter) => {
        navigate(`/hadith/${book_id}/chapters/${chapter}`);
    };

    return (
        <div className="liked-hadiths-page">
            <Helmet>
                <title>Liked Hadiths</title>
            </Helmet>
            <Header />
            <div className="page-content">
                <div className="liked-hadiths-container">
                    <h1 className="page-title">Liked Hadiths</h1>
                    
                    {loading && (
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    )}
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    {!loading && !error && likedHadiths.length === 0 && (
                        <div className="no-data-message">
                            You haven't liked any hadiths yet.
                        </div>
                    )}
                    
                    {!loading && !error && likedHadiths.length > 0 && (
                        <div className="hadith-cards">
                            {likedHadiths.map((hadith, index) => (
                                <div 
                                    key={`${hadith.book_id}-${hadith.hadith_id}`}
                                    className="hadith-item"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="hadith-header">
                                        <div className="hadith-info">
                                            <h2>Hadith #{hadith.hadith_id}</h2>
                                            <span 
                                                className="chapter-link"
                                                onClick={() => navigateToChapter(hadith.book_id, hadith.chapter)}
                                            >
                                                Book {hadith.book_id}, Chapter {hadith.chapter}
                                            </span>
                                        </div>
                                        <div className="hadith-actions">
                                            <button 
                                                className="unlike-button"
                                                onClick={() => handleUnlike(hadith.book_id, hadith.hadith_id)}
                                                title="Remove from favorites"
                                            >
                                                <FaHeart className="heart-icon" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {hadith.narrator && (
                                        <div className="hadith-narrator">
                                            <strong>Narrator:</strong> {hadith.narrator}
                                        </div>
                                    )}
                                    
                                    <div className="arabic-text">{hadith.arabic}</div>
                                    
                                    {hadith.english && (
                                        <div className="hadith-translation">
                                            <strong>Translation:</strong> {hadith.english}
                                        </div>
                                    )}
                                    
                                    {hadith.grade && (
                                        <div className="hadith-grade">
                                            <strong>Grade:</strong> <span className={`grade-${hadith.grade.toLowerCase()}`}>{hadith.grade}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LikedHadiths;


