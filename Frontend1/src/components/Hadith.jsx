import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import './css/Hadith.css';
import { useNavigate } from 'react-router-dom';
import LoginPrompt from './loginprompt';
import HadithSearch from './HadithSearch';

const Hadith = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hadith, setHadith] = useState([]);
    const username = window.localStorage.getItem('username');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hadithRefs = useRef({});

    useEffect(() => {
        const fetchHadith = async () => {
            try {
                const response = await axios.get('http://localhost:5143/api/hadithbooks/get');
                setHadith(response.data);
            } catch (err) {
                setError('Failed to fetch hadith books');
                console.error('Error fetching hadith books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHadith();
    }, []);

    // Handle auto-scrolling when coming from search
    useEffect(() => {
        if (location.state?.scrollToHadith) {
            const hadithId = location.state.scrollToHadith;
            setTimeout(() => {
                const element = hadithRefs.current[hadithId];
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Remove the scroll state to prevent re-scrolling on re-renders
                    window.history.replaceState({}, document.title);
                }
            }, 500); // Small delay to ensure content is loaded
        }
    }, [location.state]);

    const handleHadithClick = (book_id) => {
        navigate(`/hadith/${book_id}/chapters`);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="hadith-page">
            <Helmet>
                <title>Hadiths</title>
            </Helmet>
            <Header />
            {username ? (
                <div className="hadith-content" style={{ marginTop: '100px' }}>
                    <h1 className="page-title">Hadith Collection</h1>
                    <div className="hadith-header">
                        <h1>Hadith Collections</h1>
                        <HadithSearch />
                    </div>
                    <div className="hadith-grid">
                        {hadith.map((hadithBook) => (
                            hadithBook.numHadith > 0 ? (
                                <div
                                    key={hadithBook.book_id} 
                                    className="hadith-card"
                                    onClick={() => {
                                        handleHadithClick(hadithBook.book_id);
                                    }}
                                    style={{cursor: 'pointer'}}
                                    ref={el => hadithRefs.current[hadithBook.book_id] = el}
                                >
                                    <div className="hadith-header">
                                        <h3 className="hadith-title">
                                            {hadithBook.book_name_english}
                                        </h3>
                                        <span className="hadith-chapters">
                                            Chapters: {hadithBook.Chapters}
                                        </span>
                                    </div>
                                    <div className="hadith-body">
                                        <p className="hadith-count">
                                            Hadiths: {hadithBook.numHadith}
                                        </p>
                                    </div>
                                </div>
                            ) : (<React.Fragment key={hadithBook.book_id}></React.Fragment>)
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

export default Hadith;



