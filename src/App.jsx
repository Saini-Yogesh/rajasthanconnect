import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Explorer from './components/Explorer/Explorer';
import Crafts from './components/Crafts/Crafts';
import Directory from './components/Directory/Directory';
import Community from './components/Community/Community';
import Footer from './components/Footer/Footer';
import './Appcss.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const toggleScrollBtn = () => {
      if (window.scrollY > 300) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', toggleScrollBtn);
    return () => window.removeEventListener('scroll', toggleScrollBtn);
  }, []);

  // Handle section scrolling
  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Offset for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = section.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle Search submit from Hero
  const handleHeroSearch = (query) => {
    setSearchQuery(query);
    scrollToSection('directory');
  };

  // Handle City Selection from Explorer
  const handleCitySelect = (cityName) => {
    setCityFilter(cityName);
    scrollToSection('directory');
  };

  // Reset all directory filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setCityFilter('');
  };

  return (
    <div className="appWrapper">
      <Navbar onNavigate={scrollToSection} activeTab={activeTab} />
      
      <main className="mainContent">
        <Hero onSearch={handleHeroSearch} />
        
        <div className="introSection">
          <h2 className="introTitle">Rajasthan Connect</h2>
          <div className="introDivider"></div>
          <p className="introText">
            Welcome to the digital gateway connecting you directly to local tour guides, 
            royal stays, unique handicrafts, and immersive desert safaris.
          </p>
        </div>

        <Explorer onSelectCity={handleCitySelect} />
        <Crafts />
        <Directory 
          externalSearch={searchQuery} 
          activeCityFilter={cityFilter}
          onResetFilters={handleResetFilters}
        />
        <Community />
      </main>

      <Footer onNavigate={scrollToSection} />

      {/* Back to Top */}
      <button 
        className={`backToTop ${showScrollBtn ? 'backToTopVisible' : ''}`}
        onClick={() => scrollToSection('hero')}
        aria-label="Scroll back to top"
      >
        <ArrowUp size={20} />
      </button>
      <Analytics />
    </div>
  );
}
