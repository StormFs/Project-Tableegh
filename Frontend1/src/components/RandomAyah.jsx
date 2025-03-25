import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import './css/SharedAnimations.css';
import './css/RandomAyah.css';


const RandomAyah = () => {
    const [random, setRandom] = useState([]);

    useEffect(() => {
        const fetchRandomAyah = async () => {
            try {
                const response = await axios.get('http://localhost:5143/api/randomayah');
                if (response.data.verse) {
                    setRandom(response.data.verse);
                    console.log(response.data.verse);
                } else {
                    console.error('Verse not found');
                }
            } catch (error) {
                console.error('Error fetching random ayah:', error);
            }
        };
        fetchRandomAyah();
    }, []);

    return (
        <div>
            <Helmet>
                <title>Tableegh - Random Ayah</title>
            </Helmet>
            <Header />
            <div className="content" style={{ marginTop: '100px' }}>
                <h1 style={{ textAlign: 'center' }}>Ayah of the Day</h1>
                <div className="section">
                    <h2 style={{ textAlign: 'center' }}>{random.surah_name_arabic}</h2>
                    <h6 style={{ textAlign: 'center' }}>{random.verse_number}</h6>
                    <p style={{ textAlign: 'center' }}>{random.arabic}</p>
                    <p style={{ textAlign: 'center' }}>{random.english}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RandomAyah;
