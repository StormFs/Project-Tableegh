import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import './css/Hadith.css';
import { useNavigate } from 'react-router-dom';
import LoginPrompt from './loginprompt';

const Hadith = () => {
    const navigate = useNavigate();
    const [hadith, setHadith] = useState([]);
    const username = window.localStorage.getItem('username');

    useEffect(() => {
        const fetchHadith = async () => {
            try {
                const response = await axios.get('http://localhost:5143/api/hadithbooks/get');
                setHadith(response.data);
            } catch (error) {
                console.error('Error fetching hadith:', error);
            }
        };
        fetchHadith();
    }, []);

    const handleHadithClick = (book_id) => {
        navigate(`/hadith/${book_id}/chapters`);
    };

    return (
        <div className="hadith-page">
            <Helmet>
                <title>Hadiths</title>
            </Helmet>
            <Header />
            {username ? (
                <div className="hadith-content" style={{ marginTop: '100px' }}>
                    <h1 className="page-title">Hadith Collection</h1>
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



