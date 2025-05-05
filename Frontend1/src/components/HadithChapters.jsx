import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import './css/SharedAnimations.css';
import './css/HadithChapters.css';
import LoginPrompt from './loginprompt';
import { FaBook, FaSearch } from 'react-icons/fa';

const HadithChapters = () => {
    const { book_id } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [hadithRanges, setHadithRanges] = useState({});
    const username = window.localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5143/api/hadith/${book_id}/chapters`);
                setChapters(response.data);
                setFilteredChapters(response.data);
                
                // Fetch min/max hadith IDs for each chapter
                const ranges = {};
                for (const chapter of response.data) {
                    try {
                        const rangeResponse = await axios.get(`http://localhost:5143/api/hadith/minmax/${chapter.book_id}/${chapter.chapter}`);
                        if (rangeResponse.data) {
                            ranges[chapter.chapter] = {
                                min: rangeResponse.data.min_id,
                                max: rangeResponse.data.max_id
                            };
                        }
                    } catch (err) {
                        console.error(`Error fetching range for chapter ${chapter.chapter}:`, err);
                    }
                }
                setHadithRanges(ranges);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching chapters:', err);
                setError('Failed to load chapters. Please try again later.');
                setLoading(false);
            }
        };
        if (book_id) {
            fetchChapters();
        }
    }, [book_id]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredChapters(chapters);
        } else {
            const filtered = chapters.filter(chapter => 
                chapter.sanad.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChapters(filtered);
        }
    }, [searchTerm, chapters]);

    const handleChapterClick = (chapter) => {
        navigate(`/hadith/${book_id}/chapters/${chapter.chapter}`);
    };

    return (
        <div className="hadith-chapters-page">
            <Helmet>
                <title>Hadith Chapters</title>
            </Helmet>
            <Header />
            {username ? (
                <div className="hadith-chapters-container">
                    <div className="page-header">
                        <h1>Hadith Chapters</h1>
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
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
                    
                    <div className="chapters-grid">
                        {filteredChapters.map((chapter, index) => (
                            <div 
                                key={chapter.chapter} 
                                className="chapter-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handleChapterClick(chapter)}
                            >
                                <div className="chapter-icon">
                                    <FaBook />
                                </div>
                                <div className="chapter-content">
                                    <h3 className="chapter-title">{chapter.sanad}</h3>
                                    <p className="chapter-number">Chapter {chapter.chapter}</p>
                                    {hadithRanges[chapter.chapter] && (
                                        <p className="hadith-range">
                                            Hadiths: {hadithRanges[chapter.chapter].min} - {hadithRanges[chapter.chapter].max}
                                        </p>
                                    )}
                                </div>
                                <div className="chapter-hover">
                                    <span>View Hadiths</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <LoginPrompt />
            )}
            <Footer />
        </div>
    );
};

export default HadithChapters;

