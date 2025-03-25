import React from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import './css/Home.css';
import quran from './assets/quran.jpeg';
import hadith from './assets/hadith.jpeg';
import Footer from './Footer';  
import { Helmet } from 'react-helmet';
import RandomAyah from './RandomAyah';
import LoginPrompt from './loginprompt';

const Home = () => {
    const username = window.localStorage.getItem('username');
    const navigate = useNavigate();
    const handleQuran = () => {
        navigate('/quran');
    }
    const handleHadith = () => {
        navigate('/hadith');
    }
    return (
        <div>
            <Helmet>
                <title>Tableegh - Home</title>
            </Helmet>
            <Header />
            {username ? (
            <div className="content" style={{ marginTop: '100px' }}>
                <h1 style={{ textAlign: 'center' }}>Welcome to Tableegh - {username}</h1>
                <div className="section">
                    <img src={quran} alt="Quran Book" />
                    <div>
                        <h2 style={{ textAlign: 'center' }}>The Importance of Reciting the Quran</h2>
                <p style={{ textAlign: 'center' }}>The Quran is the holy book of Islam, believed to be the word of God as revealed to the Prophet Muhammad. Reciting the Quran is a fundamental practice in Islam, providing spiritual guidance, wisdom, and a sense of peace. It is considered an act of worship and a means to draw closer to Allah. The Quran contains teachings that cover all aspects of life, including morality, law, and personal conduct. Regular recitation helps Muslims to internalize these teachings and apply them in their daily lives. Moreover, it is believed that the Quran has a healing effect on the soul and body, offering comfort and solace in times of distress.</p>
                <button className="btn btn-outline-secondary" onClick={handleQuran}>Go to Quran</button>
            </div>  
            </div>
            <div className="section hadith">
                <img src={hadith} alt="Hadith Book" />
            <div>
                <h2 style={{ textAlign: 'center' }}>The Significance of Hadith</h2>
                <p style={{ textAlign: 'center' }}>Hadith refers to the sayings, actions, and approvals of the Prophet Muhammad. It is the second most important source of guidance in Islam after the Quran. The Hadith provides context and elaboration on the Quranic verses, helping Muslims to understand and implement the teachings of Islam in their lives. It covers various aspects of life, including worship, ethics, social interactions, and legal matters. Studying Hadith is essential for gaining a comprehensive understanding of the Islamic faith and for following the example set by the Prophet. The Hadith also serves as a source of inspiration and motivation, encouraging Muslims to strive for excellence in their faith and conduct.</p>
                <button className="btn btn-outline-secondary" onClick={handleHadith}>Go to Hadith</button>
            </div>
        </div>
        <RandomAyah />
        </div>
        ) : (
            <LoginPrompt />
        )}
        <Footer />
            </div>
    );
};

export default Home;