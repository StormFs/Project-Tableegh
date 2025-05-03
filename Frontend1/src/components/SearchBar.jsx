import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';

const SearchBar = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/searched/${search}`  , { replace: true });
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search verses..."
                />
            </form>
        </div>
    );
};

export default SearchBar;