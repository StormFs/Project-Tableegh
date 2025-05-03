import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './css/SharedAnimations.css';
import './css/RandomAyah.css';
import './css/RandomHadith.css';
import { Button } from '@mui/material';

const RandomHadith = () => {
    const [random, setRandom] = useState([]);
    useEffect(() => {
        const fetchRandomHadith = async () => {
            try {
                const response = await axios.get('http://localhost:5143/api/randomhadith');
                if (response.data.hadith) {
                    setRandom(response.data.hadith);
                } else {
                    console.error('Verse not found');
                }
            } catch (error) {
                console.error('Error fetching random hadith:', error);
            }
        };
        fetchRandomHadith();
    }, []);
    return (
        <div className="random-hadith-container">
            <div className="hadith-content">
                <h2>Hadith of the Day</h2>
                <div className="hadith-card">
                    <h3>{random.book_name_english}</h3>
                    <h6>{random.hadith_id}</h6>
                    <hr/>
                    <p className="arabic-text">{random.arabic}</p>
                    <p className="english-text">{random.english}</p>
                    <hr/>
                    <p className="grade-text">{random.grade}</p>
                    <div className="button-container">
                        <Button variant='Secondary'>Goto Hadith</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomHadith;
