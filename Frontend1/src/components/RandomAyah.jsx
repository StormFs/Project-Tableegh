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
        <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '40px'
        }}>
            <h2 style={{ 
                textAlign: 'center',
                color: '#4a6baf',
                fontSize: '1.8rem',
                marginBottom: '20px'
            }}>Ayah of the Day</h2>
            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ 
                    textAlign: 'center',
                    color: '#333',
                    fontSize: '1.4rem',
                    marginBottom: '15px'
                }}>{random.surah_name_arabic}</h3>
                <h6 style={{ 
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '1rem',
                    marginBottom: '20px'
                }}>Verse {random.verse_number}</h6>
                <p style={{ 
                    textAlign: 'right',
                    direction: 'rtl',
                    fontSize: '1.5rem',
                    lineHeight: '2',
                    marginBottom: '20px',
                    fontFamily: 'Al Qalam Indopak Arabic Font'
                }}>{random.arabic}</p>
                <p style={{ 
                    textAlign: 'center',
                    color: '#555',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                }}>{random.english}</p>
            </div>
        </div>
    );
};

export default RandomAyah;
