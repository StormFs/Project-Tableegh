import React from 'react';
import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import './css/SharedAnimations.css';
import './css/HadithChapters.css';
import { useNavigate } from 'react-router-dom';
import LoginPrompt from './loginprompt';

const HadithChapters = () => {
    const { book_id } = useParams();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = window.localStorage.getItem('username');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5143/api/hadith/${book_id}/chapters`);
                setChapters(response.data);
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

    return (
        <div className="hadith-chapters-page">
            <Helmet>
                <title>Hadith Chapters</title>
            </Helmet>
            <Header />
            {username ? (
                <div className="hadith-chapters-container">
                    <h1 style={{textAlign: 'center', marginTop: '100px', marginBottom: '50px'}}>Hadith Chapters</h1>
                    
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
                    {chapters.map((chapter, index) => (
                        <div 
                            key={chapter.chapter} 
                            className="hadith-chapter-card" 
                            style={{
                                animationDelay: `${index * 0.1}s`, 
                                padding: '20px', 
                                borderRadius: '10px', 
                                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
                                margin: '10px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                navigate(`/hadith/${book_id}/chapters/${chapter.chapter}`);
                            }}
                        >
                            <h3>{chapter.sanad}</h3>
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

