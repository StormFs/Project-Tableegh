import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import './css/SharedAnimations.css';
import './css/Chapters.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Chapters = () => {
    const { book_id, chapter } = useParams();
    const [chapterData, setChapterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedHadiths, setLikedHadiths] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchChapterData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5143/api/hadith/${book_id}/chapters/${chapter}`);
                setChapterData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching chapter data:', err);
                setError('Failed to load chapter data. Please try again later.');
                setLoading(false);
            }
        };
        if (book_id && chapter) {
            fetchChapterData();
        }
    }, [book_id, chapter]);
    useEffect(() => {
        const fetchLikedHadiths = async () => {
            if (!username) return;
            try {
                const response = await axios.get(`http://localhost:5143/api/liked-hadiths/${username}`);
                if (response.data && Array.isArray(response.data)) {
                    const formattedData = response.data.map(item => ({
                        ...item,
                        book_id: String(item.book_id),
                        hadith_id: String(item.hadith_id)
                    }));
                    setLikedHadiths(formattedData);
                }
            } catch (err) {
                console.error('Error fetching liked hadiths:', err);
            }
        };
        fetchLikedHadiths();
    }, [username]);
    const handleLikeToggle = async (hadith_id) => {
        if (!username) {
            alert('Please login to like hadiths');
            return;
        }
        try {
            const stringHadithId = String(hadith_id);
            const stringBookId = String(book_id);
            const isLiked = likedHadiths.some(
                likedHadith => 
                    String(likedHadith.hadith_id) === stringHadithId && 
                    String(likedHadith.book_id) === stringBookId
            );
            if (isLiked) {
                await axios.delete(`http://localhost:5143/api/liked-hadiths/${username}/${book_id}/${hadith_id}`);
                setLikedHadiths(prevLikedHadiths => 
                    prevLikedHadiths.filter(
                        h => !(String(h.hadith_id) === stringHadithId && String(h.book_id) === stringBookId)
                    )
                );
            } else {
                const response = await axios.post('http://localhost:5143/api/liked-hadiths', {
                    username: username,
                    book_id: book_id,
                    hadith_id: hadith_id
                });
                if (response.status === 200 || response.status === 201) {
                    setLikedHadiths(prevLikedHadiths => [
                        ...prevLikedHadiths, 
                        { username, book_id: stringBookId, hadith_id: stringHadithId }
                    ]);
                }
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };
    const isHadithLiked = (hadithId) => {
        const stringHadithId = String(hadithId);
        const stringBookId = String(book_id);
        return likedHadiths.some(
            likedHadith => 
                String(likedHadith.hadith_id) === stringHadithId && 
                String(likedHadith.book_id) === stringBookId
        );
    };
    return (
        <div className="chapters-page">
            <Helmet>
                <title>Chapter {chapter} : </title>
            </Helmet>
            <Header />
            <div className="chapters-container" style={{marginTop: '100px', padding: '20px'}}>
                <h1 style={{textAlign: 'center', marginBottom: '30px'}}>Chapter {chapter}</h1>
                
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
                
                {!loading && !error && chapterData && chapterData.length > 0 ? (
                    chapterData.map((hadith) => (
                        <div 
                            key={hadith.hadith_id} 
                            className="hadith-item"
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                                padding: '20px',
                                marginBottom: '20px'
                            }}
                        >
                            <div className="hadith-header">
                                <h2>Hadith #{hadith.hadith_id}</h2>
                                <div className="hadith-actions">
                                    <button 
                                        className="like-button"
                                        onClick={() => handleLikeToggle(hadith.hadith_id)}
                                    >
                                        {isHadithLiked(hadith.hadith_id) ? (
                                            <FaHeart className="heart-icon filled" />
                                        ) : (
                                            <FaRegHeart className="heart-icon" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {hadith.narrator && <p><strong>Narrator:</strong> {hadith.narrator}</p>}
                            <p className="arabic-text" style={{textAlign: 'right', direction: 'rtl', fontFamily: 'Amiri, serif', fontSize: '1.2rem'}}>{hadith.arabic}</p>
                            {hadith.english && <p><strong>Translation:</strong> {hadith.english}</p>}
                            {hadith.grade && <p><strong>Grade:</strong> {hadith.grade}</p>}
                        </div>
                    ))
                ) : (
                    !loading && !error && (
                        <div className="no-data-message" style={{textAlign: 'center'}}>
                            No hadith found in this chapter.
                        </div>
                    )
                )}
            </div>
            <Footer />
        </div>
    );
}   

export default Chapters;