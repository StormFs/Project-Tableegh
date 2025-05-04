import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';
import axios from 'axios';

const SearchBar = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState({ verses: [], surahs: [] });
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

    // Fetch search results
    const fetchResults = useCallback(async (query) => {
        if (!query.trim()) {
            setResults({ verses: [], surahs: [] });
            return;
        }
        setLoading(true);
        try {
            const [versesResponse, surahsResponse] = await Promise.all([
                axios.get(`http://localhost:8080/api/search/${query}`),
                axios.get(`http://localhost:8080/api/searchsurah/${query}`)
            ]);
            setResults({
                verses: versesResponse.data,
                surahs: surahsResponse.data
            });
        } catch (error) {
            console.error('Error fetching search results:', error);
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
                    placeholder="Search verses..."
                />
            </form>
            {search.trim() && (
                <div className="live-results">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : (
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
                            {!loading && results.surahs.length === 0 && results.verses.length === 0 && (
                                <div className="no-results">No results found</div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;