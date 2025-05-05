import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './css/IndividualHadith.css';

const IndividualHadith = () => {
    const { book_id, chapter, hadith_id } = useParams();
    const [hadith, setHadith] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHadith = async () => {
            try {
                const response = await axios.get(`http://localhost:5143/api/hadith/${chapter}/${hadith_id}`);
                setHadith(response.data);
            } catch (err) {
                setError('Failed to fetch hadith');
                console.error('Error fetching hadith:', err);
            } finally {
                setLoading(false);
            }
        };

        const checkLikedStatus = async () => {
            if (!username) return;
            try {
                const response = await axios.get(`http://localhost:5143/api/liked-hadiths/${username}`);
                const likedHadiths = response.data;
                setIsLiked(likedHadiths.some(h => h.hadith_id === hadith_id && h.chapter === chapter));
            } catch (err) {
                console.error('Error checking liked status:', err);
            }
        };

        fetchHadith();
        checkLikedStatus();
    }, [chapter, hadith_id, username]);

    const handleLikeToggle = async () => {
        if (!username) {
            alert('Please login to like hadiths');
            return;
        }

        try {
            if (isLiked) {
                await axios.delete(`http://localhost:5143/api/liked-hadiths/${username}/${hadith.book_id}/${hadith_id}`);
            } else {
                await axios.post(`http://localhost:5143/api/liked-hadiths`, {
                    username,
                    book_id: hadith.book_id,
                    hadith_id,
                    chapter
                });
            }
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('Error toggling like status:', err);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!hadith) return <div className="no-hadith">Hadith not found</div>;

    return (
        <div className="individual-hadith">
            <Helmet>
                <title>Hadith {hadith_id} | Chapter {chapter}</title>
            </Helmet>
            <Header />
            <div className="hadith-container">
                <div className="hadith-header">
                    <h1>Hadith #{hadith_id}</h1>
                    <button onClick={() => navigate(-1)} className="back-button">
                        Back to Chapter
                    </button>
                    <button 
                        className="like-button"
                        onClick={handleLikeToggle}
                        title={isLiked ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isLiked ? (
                            <FaHeart className="heart-icon filled" />
                        ) : (
                            <FaRegHeart className="heart-icon" />
                        )}
                    </button>
                </div>
                <div className="hadith-content">
                    <div className="arabic-text">
                        {hadith.arabic}
                    </div>
                    <div className="english-text">
                        {hadith.english}
                    </div>
                    {hadith.grade && (
                        <div className="hadith-grade">
                            Grade: {hadith.grade}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default IndividualHadith; 