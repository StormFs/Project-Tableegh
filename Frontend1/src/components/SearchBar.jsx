import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/SearchBar.css';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
                <IconButton type="submit" size="large">
                    <SearchIcon />
                </IconButton>
            </form>
        </div>
    );
};

export default SearchBar;