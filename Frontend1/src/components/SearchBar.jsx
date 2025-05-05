import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';
import axios from 'axios';

const SearchBar = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState({ verses: [], surahs: [] });
    const [loading, setLoading] = useState({ verses: false, surahs: false });
    const navigate = useNavigate();

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch search results
    const fetchResults = useCallback(async (query) => {
        if (!query.trim()) {
            setResults({ verses: [], surahs: [] });
            setLoading({ verses: false, surahs: false });
            return;
        }

        // Reset results and set loading states
        setResults({ verses: [], surahs: [] });
        setLoading({ verses: true, surahs: true });

        // Fetch verses
        axios.get(`http://localhost:8080/api/search/${query}`)
            .then(response => {
                setResults(prev => ({ ...prev, verses: response.data }));
                setLoading(prev => ({ ...prev, verses: false }));
            })
            .catch(error => {
                console.error('Error fetching verses:', error);
                setLoading(prev => ({ ...prev, verses: false }));
            });

        // Fetch surahs
        axios.get(`http://localhost:8080/api/searchsurah/${query}`)
            .then(response => {
                setResults(prev => ({ ...prev, surahs: response.data }));
                setLoading(prev => ({ ...prev, surahs: false }));
            })
            .catch(error => {
                console.error('Error fetching surahs:', error);
                setLoading(prev => ({ ...prev, surahs: false }));
            });
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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/searched/${search}`, { replace: true });
        }
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={search}
                    onChange={handleChange}
                    placeholder="Search Quran..."
                />
            </form>
            {search.trim() && (
                <div className="live-results">
                    {Object.values(loading).some(isLoading => isLoading) && (
                        <div className="loading">Loading...</div>
                    )}
                    <>
                        {results.surahs.length > 0 && (
                            <div className="results-section">
                                <h3>Surahs ({results.surahs.length})</h3>
                                <div className="results-list">
                                    {results.surahs.map(surah => (
                                        <div 
                                            key={surah.surah_number}
                                            className="result-item"
                                            onClick={() => navigate(`/quran/${surah.surah_number}`)}
                                        >
                                            {surah.surah_name_arabic} - {surah.surah_name_english}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {results.verses.length > 0 && (
                            <div className="results-section">
                                <h3>Verses ({results.verses.length})</h3>
                                <div className="results-list">
                                    {results.verses.map(verse => (
                                        <div 
                                            key={`${verse.surah_number}-${verse.verse_number}`}
                                            className="result-item"
                                            onClick={() => navigate(`/quran/${verse.surah_number[0]}?verse=${verse.verse_number}`)}
                                        >
                                            {verse.surah_name_arabic} {verse.verse_number}: {verse.english.substring(0, 50)}...
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!Object.values(loading).some(isLoading => isLoading) && 
                         results.surahs.length === 0 && 
                         results.verses.length === 0 && (
                            <div className="no-results">No results found</div>
                        )}
                    </>
                </div>
            )}
        </div>
    );
};

export default SearchBar;