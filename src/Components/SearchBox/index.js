import React, { useState } from 'react';

const SearchBox = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <form onSubmit={handleSearch} className="search-box w-100" size="small">
            <input
                type="text"
                placeholder="Search by title, author, genres, or publisher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-100"
                inputProps={{ 'aria-label': 'Without label' }}
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
};

export default SearchBox;



