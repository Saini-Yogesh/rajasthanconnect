import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import './Herocss.css';

export default function Hero({ onSearch }) {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  const handleTagClick = (tag) => {
    setSearchVal(tag);
    onSearch(tag);
  };

  return (
    <header className="hero">
      <div className="heroContent">
        <span className="badge">Welcome to the Land of Kings</span>
        <h1 className="title">
          Connecting You to the Heart of <span className="titleSpan">Rajasthan</span>
        </h1>
        <p className="description">
          Discover majestic forts, vibrant local crafts, and experienced guides. 
          Your unified digital gateway to explore, connect, and experience the royal heritage.
        </p>

        <form onSubmit={handleSearchSubmit} className="searchContainer">
          <div className="searchInputWrapper">
            <Search size={20} />
            <input 
              type="text" 
              className="searchInput" 
              placeholder="Search cities, local guides, heritage stays, artisans..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <button type="submit" className="searchButton">
            Explore
          </button>
        </form>

        <div className="quickTags">
          <span>Popular:</span>
          <button className="tag" onClick={() => handleTagClick('Jaipur')}>Jaipur</button>
          <button className="tag" onClick={() => handleTagClick('Local Guide')}>Local Guides</button>
          <button className="tag" onClick={() => handleTagClick('Udaipur stay')}>Udaipur</button>
          <button className="tag" onClick={() => handleTagClick('Blue Pottery')}>Blue Pottery</button>
          <button className="tag" onClick={() => handleTagClick('Camel Safari')}>Camel Safari</button>
        </div>
      </div>
    </header>
  );
}
