import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './Header';
import Footer from './Footer';
import './css/Hadith.css';

const Hadith = () => {
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

    return (
        <div className="hadith-page">
            <Helmet>
                <title>Hadiths</title>
            </Helmet>
            <Header />
            <div className="hadith-content" style={{ marginTop: '100px' }}>
                <h1 className="page-title">Hadith Collection</h1>
                <div className="hadith-grid">
                    {hadith.map((hadith) => (
                        hadith.numHadith > 0 ? (
                        <div
                            key={hadith.hadith_id} 
                            className="hadith-card"
                        >
                            <div className="hadith-header">
                                <h3 className="hadith-title">
                                    {hadith.book_name_english}
                                </h3>
                                <span className="hadith-chapters">
                                    Chapters: {hadith.Chapters}
                                </span>
                            </div>
                            <div className="hadith-body">
                                <p className="hadith-count">
                                    Hadiths: {hadith.numHadith}
                                </p>
                            </div>
                        </div>
                        ):(<></>)
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Hadith;



