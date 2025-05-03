import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './css/SharedAnimations.css';
import './css/RandomAyah.css';
import { Button } from '@mui/material';

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
        <div className="random-ayah-container">
            <div className="ayah-content">
                <h2>Ayah of the Day</h2>
                <div className="ayah-card">
                    <h3>{random.surah_name_arabic}</h3>
                    <h6>Verse {random.verse_number}</h6>
                    <hr/>
                    <p className="arabic-text">{random.arabic}</p>
                    <p className="english-text">{random.english}</p>
                    <div className="button-container">
                        <Button variant='Secondary'>Goto Ayah</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomAyah;
