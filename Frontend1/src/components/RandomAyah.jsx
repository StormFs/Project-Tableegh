import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
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
        </div>
    );
};

export default RandomAyah;
