import React, { useState, useEffect } from 'react';
import { Compass, Users, Palette, Hotel, Star, MapPin, Phone, MessageCircle, LayoutGrid } from 'lucide-react';
import './Directorycss.css';

const LISTINGS = [
  {
    id: 1,
    title: 'Shree Balaji Heritage Tours',
    category: 'Guides',
    rating: 4.9,
    location: 'Jaipur, Rajasthan',
    description: 'Specializing in historical walking tours of Hawa Mahal, Amer Fort, and Jantar Mantar. Licensed English and Hindi speaking guides.',
    phone: '+91 98290 12345'
  },
  {
    id: 2,
    title: 'Rajputana Desert Safari & Camp',
    category: 'Experiences',
    rating: 4.8,
    location: 'Jaisalmer, Rajasthan',
    description: 'Unforgettable camel safaris across Sam Sand Dunes, followed by luxury tent stays and authentic Rajasthani folk music performances.',
    phone: '+91 94140 56789'
  },
  {
    id: 3,
    title: 'Lake City Royal Palace Stay',
    category: 'Stays',
    rating: 4.7,
    location: 'Udaipur, Rajasthan',
    description: 'Experience true royal hospitality at our lakefront heritage hotel. Stunning views of Lake Pichola and authentic Mewari dining.',
    phone: '+91 294 2420001'
  },
  {
    id: 4,
    title: 'Mahaveer Blue Pottery Workshop',
    category: 'Artisans',
    rating: 4.9,
    location: 'Jaipur, Rajasthan',
    description: 'Learn block printing and blue pottery from award-winning artisans. Buy directly from local craftspeople at workshop rates.',
    phone: '+91 98870 98765'
  },
  {
    id: 5,
    title: 'Desert Explorer Guides - Vikram Singh',
    category: 'Guides',
    rating: 4.9,
    location: 'Jodhpur, Rajasthan',
    description: 'Exploring Jodhpur and Mehrangarh Fort since 2012. Private custom tours focused on history, food, and hidden blue-painted streets.',
    phone: '+91 99280 43210'
  },
  {
    id: 6,
    title: 'Rani Bagh Heritage Resort',
    category: 'Stays',
    rating: 4.6,
    location: 'Jodhpur, Rajasthan',
    description: 'A beautifully preserved 19th-century haveli converted into a boutique heritage resort with a lush green courtyard and royal pool.',
    phone: '+91 291 2631234'
  },
  {
    id: 7,
    title: 'Kathputli Art & Craft Shop',
    category: 'Artisans',
    rating: 4.8,
    location: 'Udaipur, Rajasthan',
    description: 'Handmade wooden puppet makers and handicraft exporters. Standard and giant puppets clothed in authentic handloom fabrics.',
    phone: '+91 94130 90909'
  },
  {
    id: 8,
    title: 'Royal Chariot Transport Services',
    category: 'Experiences',
    rating: 4.5,
    location: 'Jaipur, Rajasthan',
    description: 'Premium car rentals, tour coaches, and royal vintage cars for weddings, palace arrivals, and interstate tourist travel.',
    phone: '+91 98280 88888'
  }
];

export default function Directory({ externalSearch, activeCityFilter, onResetFilters }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [internalSearch, setInternalSearch] = useState('');

  // Sync internal search input with external queries from Hero
  useEffect(() => {
    if (externalSearch !== undefined) {
      setInternalSearch(externalSearch);
    }
  }, [externalSearch]);

  const handleConnectClick = (listing) => {
    alert(`Connecting you to ${listing.title}...\nWhatsApp: ${listing.phone}\n(Mocking API Connection in testing)`);
  };

  const filteredListings = LISTINGS.filter((item) => {
    // 1. Category Filter
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }

    // 2. City Filter (from Explorer click)
    if (activeCityFilter && !item.location.toLowerCase().includes(activeCityFilter.toLowerCase())) {
      return false;
    }

    // 3. Search text Filter
    const searchLower = internalSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section className="directorySection" id="directory">
      <div className="sectionHeader">
        <span className="subtitle">Local Network Directory</span>
        <h2 className="sectionTitle">Connect with Verified Providers</h2>
      </div>

      <div className="controlsContainer">
        {/* Search Input */}
        <div className="searchBarWrapper">
          <input 
            type="text" 
            className="directorySearchInput" 
            placeholder="Search provider name, city, specialty, keywords..."
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
          />
          {(internalSearch || activeCityFilter) && (
            <button 
              onClick={() => {
                setInternalSearch('');
                onResetFilters();
              }}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* City Filter active label indicator */}
        {activeCityFilter && (
          <div style={{
            backgroundColor: 'rgba(224, 90, 16, 0.08)',
            border: '1px dashed var(--color-primary)',
            padding: '10px 15px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            color: 'var(--color-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Filtering by location: <strong>{activeCityFilter}</strong></span>
            <button 
              onClick={onResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Clear City
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="categoryFilterRow">
          <button 
            className={`filterTab ${activeCategory === 'All' ? 'filterTabActive' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            <LayoutGrid size={16} /> All Listings
          </button>
          <button 
            className={`filterTab ${activeCategory === 'Guides' ? 'filterTabActive' : ''}`}
            onClick={() => setActiveCategory('Guides')}
          >
            <Users size={16} /> Tour Guides
          </button>
          <button 
            className={`filterTab ${activeCategory === 'Artisans' ? 'filterTabActive' : ''}`}
            onClick={() => setActiveCategory('Artisans')}
          >
            <Palette size={16} /> Artisans
          </button>
          <button 
            className={`filterTab ${activeCategory === 'Stays' ? 'filterTabActive' : ''}`}
            onClick={() => setActiveCategory('Stays')}
          >
            <Hotel size={16} /> Stays & Havelis
          </button>
          <button 
            className={`filterTab ${activeCategory === 'Experiences' ? 'filterTabActive' : ''}`}
            onClick={() => setActiveCategory('Experiences')}
          >
            <Compass size={16} /> Experiences
          </button>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="listingsGrid">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div key={listing.id} className="listingCard">
              <div className="cardHeader">
                <span className="tagLabel">{listing.category}</span>
                <div className="ratingRow">
                  <Star size={16} fill="currentColor" color="currentColor" />
                  <span>{listing.rating}</span>
                </div>
              </div>

              <h3 className="listingTitle">{listing.title}</h3>
              
              <div className="locationRow">
                <MapPin size={14} color="var(--color-primary)" />
                <span>{listing.location}</span>
              </div>

              <p className="listingDesc">{listing.description}</p>

              <div className="contactRow">
                <div className="contactInfoText">
                  <div>Telephone Contact</div>
                  <div className="phoneNum">{listing.phone}</div>
                </div>
                <button 
                  className="connectBtn"
                  onClick={() => handleConnectClick(listing)}
                >
                  <MessageCircle size={16} fill="currentColor" /> Connect
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="noResults">
            <Compass size={48} color="var(--color-text-muted)" style={{ marginBottom: 15, animation: 'spin 10s linear infinite' }} />
            <h3>No Providers Found Matching Your Filters</h3>
            <p style={{ marginTop: 5 }}>Try searching for a different keyword or resetting your city selection.</p>
          </div>
        )}
      </div>
    </section>
  );
}
