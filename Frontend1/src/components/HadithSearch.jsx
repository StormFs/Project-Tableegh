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

        try {
            const response = await axios.get(`http://localhost:8080/api/searchchapter/${query}`);
            // Extract the results array from the response
            if (response.data && response.data.results) {
                const searchResults = response.data.results;
                setResults(searchResults);
                // Store search results in localStorage
                localStorage.setItem('searchResults', JSON.stringify(searchResults));
                localStorage.setItem('searchQuery', query);
                console.log('Search results count:', response.data.total);
            } else {
                // Handle case where response structure is different
                setResults([]);
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching hadith:', error);
            setResults([]);
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

    // Navigate to hadith and store its index in the results
    const navigateToHadith = (hadith, index) => {
        // Store the current index in localStorage
        localStorage.setItem('currentSearchIndex', index);
        
        navigate(`/hadith/${hadith.book_id}/chapters/${hadith.chapter}/hadith/${hadith.hadith_id}`, 
            { state: { fromSearch: true, searchIndex: index } }
        );
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
                                    {results.map((hadith, index) => (
                                        <div 
                                            key={`${hadith.book_id}-${hadith.hadith_id}`}
                                            className="result-item"
                                            onClick={() => navigateToHadith(hadith, index)}
                                        >
                                            <div className="hadith-header">
                                                <span className="book-name">{hadith.book_name_english || 'Hadith Book'}</span>
                                                <span className="hadith-number">Hadith #{hadith.hadith_id}</span>
                                            </div>
                                            <div className="hadith-content">
                                                <p className="arabic">{hadith.arabic}</p>
                                                <p className="english">
                                                    {hadith.english && hadith.english.length > 100 
                                                        ? `${hadith.english.substring(0, 100)}...` 
                                                        : hadith.english}
                                                </p>
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