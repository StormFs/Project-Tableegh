import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HadithSearch.css';
import axios from 'axios';

const HadithSearch = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch hadith search results
    const fetchResults = useCallback(async (query) => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setResults([]);

        try {
            const response = await axios.get(`http://localhost:8080/api/searchchapter/${query}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching hadith:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => fetchResults(query), 300),
        [fetchResults]
    );

    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    return (
        <div className="hadith-search">
            <div className="search-input">
                <input
                    type="text"
                    value={search}
                    onChange={handleChange}
                    placeholder="Search Hadith..."
                />
            </div>
            {search.trim() && (
                <div className="hadith-results">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        <>
                            {results.length > 0 ? (
                                <div className="results-list">
                                    {results.map(hadith => (
                                        <div 
                                            key={`${hadith.sanad}-${hadith.hadith_id}`}
                                            className="result-item"
                                            onClick={() => navigate(`/hadith/${hadith.book_id[0]}/chapters/${hadith.chapter}/hadith/${hadith.hadith_id}`, { state: { scrollToHadith: hadith.hadith_id } })}
                                        >
                                            <div className="hadith-header">
                                                <span className="book-name">{hadith.book_name_english}</span>
                                                <span className="hadith-number">Hadith #{hadith.hadith_id}</span>
                                            </div>
                                            <div className="hadith-content">
                                                <p className="arabic">{hadith.arabic}</p>
                                                <p className="english">{hadith.english.substring(0, 100)}...</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-results">No hadith found</div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default HadithSearch; 