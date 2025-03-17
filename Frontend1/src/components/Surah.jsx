import React from 'react';
import Header from './Header';
import { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './css/Surah.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Helmet } from 'react-helmet';

const Surah = () => {
    const { surah_number } = useParams();
    const [surah, setSurah] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(22);
    const [name, setName] = useState('');
    const [likedVerses, setLikedVerses] = useState(new Set());
    const username = window.localStorage.getItem('username');
    useEffect(() => {
        const fetchSurah = async () => {
            try {
                const response = await axios.get(`http://localhost:5143/api/surah/get/${surah_number}`);
                const surahname = await axios.get(`http://localhost:5143/api/surah/get/name/${surah_number}`);
                setName(surahname.data.name);
                setSurah(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurah();
    }, [surah_number]);

    const getlikes = async () => {
        try {
            const response = await axios.get(`http://localhost:5143/api/likes/get/${username}`);
            if (Array.isArray(response.data)) {
                const likedVerseNumbers = response.data.map(like => like.verse_number);
                setLikedVerses(new Set(likedVerseNumbers));
            } else {
                console.error('Unexpected data format:', response.data);
                setLikedVerses(new Set());
            }
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    useEffect(() => {
        getlikes();
    }, [username]);


    const toggleLike = (verseNumber) => {
        if (!username) {
            alert('Please login to continue');
            return;
        }
        handleLike(verseNumber);
        setLikedVerses((prevLikedVerses) => {
            const updatedLikedVerses = new Set(prevLikedVerses);
            if (updatedLikedVerses.has(verseNumber)) {
                updatedLikedVerses.delete(verseNumber);
            } else {
                updatedLikedVerses.add(verseNumber);
            }
            return updatedLikedVerses;
        });
    };
    

    const handleLike = async (verseNumber) => {
        try {
            const response = await axios.post(`http://localhost:5143/api/likes/add`, {
                username: username,
                verse_number: verseNumber,
                surah_number: surah_number
            });
        } catch (error) {
            console.error('Error adding like:', error);
        }
    };
    
    

    if (loading) {
        return <div>Loading...</div>;
    }   

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <Helmet>
                <title>Tableegh - Surah {surah_number}</title>
            </Helmet>
            <Header />
            <h5 style={{ marginTop: '100px', marginBottom: '20px', textAlign: 'center' }}>Font Size</h5>
            <div className="font-size-container" style={{marginBottom: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setFontSize(fontSize + 2)}>+</button>
                <p>{fontSize}</p>
                <button onClick={() => setFontSize(fontSize - 2)}>-</button>
            </div>
            <hr />
            <h1 style={{ marginTop: '20px', textAlign: 'center' }}>{name}</h1>
            <hr />
            <div className="verses-container" style={{ marginTop: '20px' }}>
                {surah.map((verse) => (
                    <ul className="verse-containers" style={{ marginBottom: '20px' }} key={verse.verse_number}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button style={{backgroundColor: 'transparent', border: 'none', marginRight: '10px'}} onClick={() => toggleLike(verse.verse_number)}>
                                {likedVerses.has(verse.verse_number) ? <FaHeart style={{color: 'red'}} size={30} /> : <FaRegHeart size={30} />}
                            </button>
                            <bdi className="verse-number" style={{ fontSize: `${fontSize}px`, display: 'flex', alignItems: 'center' }}>
                                {verse.verse_number} - {verse.arabic}
                            </bdi>
                        </div>
                        <hr />
                        <p style={{ fontSize: `${fontSize}px`, marginTop: '20px', textAlign: 'left' }}>{verse.english}</p>
                        <br />
                    </ul>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Surah;



