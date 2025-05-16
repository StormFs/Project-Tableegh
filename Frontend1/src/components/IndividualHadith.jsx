import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import { FaHeart, FaRegHeart, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './css/IndividualHadith.css';

const IndividualHadith = () => {
    const { book_id, chapter, hadith_id } = useParams();
    const [hadith, setHadith] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchQuery, setSearchQuery] = useState('');
    
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Load search results from localStorage
        const storedResults = localStorage.getItem('searchResults');
        const storedQuery = localStorage.getItem('searchQuery');
        const storedIndex = localStorage.getItem('currentSearchIndex');
        
        if (storedResults) {
            const results = JSON.parse(storedResults);
            setSearchResults(results);
            setSearchQuery(storedQuery || '');
            
            // Find current hadith in results or use stored index if available
            if (storedIndex) {
                setCurrentIndex(parseInt(storedIndex, 10));
            } else {
                const index = results.findIndex(
                    h => h.hadith_id.toString() === hadith_id && h.chapter.toString() === chapter
                );
                setCurrentIndex(index !== -1 ? index : -1);
            }
        }

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
    }, [chapter, hadith_id, username, location]);

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

    // Navigate to previous search result
    const navigateToPrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevHadith = searchResults[prevIndex];
            localStorage.setItem('currentSearchIndex', prevIndex);
            navigate(`/hadith/${prevHadith.book_id}/chapters/${prevHadith.chapter}/hadith/${prevHadith.hadith_id}`);
        }
    };

    // Navigate to next search result
    const navigateToNext = () => {
        if (currentIndex < searchResults.length - 1) {
            const nextIndex = currentIndex + 1;
            const nextHadith = searchResults[nextIndex];
            localStorage.setItem('currentSearchIndex', nextIndex);
            navigate(`/hadith/${nextHadith.book_id}/chapters/${nextHadith.chapter}/hadith/${nextHadith.hadith_id}`);
        }
    };

    // Clear search results and return to normal navigation
    const clearSearchResults = () => {
        localStorage.removeItem('searchResults');
        localStorage.removeItem('currentSearchIndex');
        localStorage.removeItem('searchQuery');
        setSearchResults([]);
        setCurrentIndex(-1);
        setSearchQuery('');
    };

    // Return to search results
    const backToSearch = () => {
        navigate(-1);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!hadith) return <div className="no-hadith">Hadith not found</div>;

    const showSearchNavigation = searchResults.length > 0 && currentIndex !== -1;

    return (
        <div className="individual-hadith">
            <Helmet>
                <title>Hadith {hadith_id} | Chapter {chapter}</title>
            </Helmet>
            <Header />
            <div className="hadith-container">
            <div className="hadith-header">
                    <h3>{hadith.book_name_english}</h3>
                    <h1>Hadith #{hadith_id}</h1>
                    
                    <div className="navigation-buttons">
                        <button onClick={backToSearch} className="back-button">
                            Back to {searchQuery ? `"${searchQuery}" Results` : "Chapter"}
                        </button>
                        
                        {showSearchNavigation && (
                            <div className="search-navigation">
                                <button 
                                    onClick={navigateToPrevious} 
                                    disabled={currentIndex <= 0}
                                    className="nav-button prev-button"
                                >
                                    <FaArrowLeft /> Previous
                                </button>
                                <span className="search-position">
                                    {currentIndex + 1} of {searchResults.length}
                                </span>
                                <button 
                                    onClick={navigateToNext} 
                                    disabled={currentIndex >= searchResults.length - 1}
                                    className="nav-button next-button"
                                >
                                    Next <FaArrowRight />
                                </button>
                                <button 
                                    onClick={clearSearchResults}
                                    className="clear-search-button"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                        
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