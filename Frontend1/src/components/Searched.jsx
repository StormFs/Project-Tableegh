import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Searched = () => {
    const { search } = useParams();
    const [verses, setVerses] = useState([]);


    useEffect(() => {
        const fetchVerses = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/search/${search}`);
                setVerses(response.data);
                console.log(response.data); 
            } catch (error) {
                console.error('Error fetching verses:', error);
            }
        };
        fetchVerses();
    }, [search]);




    return (
        <div>
            <h1>Searched {search} : {verses.length} verses</h1>
            {verses.map((verse) => (
                <div key={verse.verse_number + '-' + verse.surah_number} >
                    <p>{verse.verse_number}</p>
                    <p dangerouslySetInnerHTML={{
                        __html: verse.english.replace(
                            new RegExp(search, 'gi'),
                            `<mark class="highlight">${search}</mark>`
                        )
                    }}></p>
                    <p>{verse.arabic}</p>
                    <p>{verse.surah_number}</p>
                </div>
            ))}
        </div>
    );
};

export default Searched;
