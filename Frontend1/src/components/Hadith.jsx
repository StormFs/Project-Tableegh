import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './Header';

const Hadith = () => {
    const [hadiths, setHadiths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHadiths = async () => {
            try {
                const response = await axios.get('http://localhost:5143/api/hadiths');
                setHadiths(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHadiths();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }  
    
    return (
        <div>
            <Helmet>
                <title>Hadiths</title>
            </Helmet>
            <Header />
        </div>
    );  
};

export default Hadith;



