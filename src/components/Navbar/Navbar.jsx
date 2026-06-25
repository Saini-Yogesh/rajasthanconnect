import React, { useState, useEffect } from 'react';
import { Compass, Menu, X } from 'lucide-react';
import './Navbarcss.css';

export default function Navbar({ onNavigate, activeTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (tabId) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbarScrolled' : ''}`}>
        <div className="logo" onClick={() => handleNavLinkClick('hero')} style={{ cursor: 'pointer' }}>
          <Compass className="logoIcon" size={32} color="var(--color-primary)" />
          <span>Rajasthan<span className="logoSpan">Connect</span></span>
        </div>

        <div className="navLinks">
          <span 
            className={`navLink ${activeTab === 'explore' ? 'active' : ''}`} 
            onClick={() => handleNavLinkClick('explore')}
          >
            Explore Cities
          </span>
          <span 
            className={`navLink ${activeTab === 'crafts' ? 'active' : ''}`} 
            onClick={() => handleNavLinkClick('crafts')}
          >
            Heritage & Crafts
          </span>
          <span 
            className={`navLink ${activeTab === 'directory' ? 'active' : ''}`} 
            onClick={() => handleNavLinkClick('directory')}
          >
            Business Directory
          </span>
          <span 
            className={`navLink ${activeTab === 'community' ? 'active' : ''}`} 
            onClick={() => handleNavLinkClick('community')}
          >
            Community Hub
          </span>
          <button className="ctaButton" onClick={() => handleNavLinkClick('community')}>
            Join Network
          </button>
        </div>

        <button 
          className="mobileMenuBtn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`mobileMenu ${mobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
        <span 
          className="mobileMenuLink" 
          onClick={() => handleNavLinkClick('explore')}
        >
          Explore Cities
        </span>
        <span 
          className="mobileMenuLink" 
          onClick={() => handleNavLinkClick('crafts')}
        >
          Heritage & Crafts
        </span>
        <span 
          className="mobileMenuLink" 
          onClick={() => handleNavLinkClick('directory')}
        >
          Business Directory
        </span>
        <span 
          className="mobileMenuLink" 
          onClick={() => handleNavLinkClick('community')}
        >
          Community Hub
        </span>
        <button 
          className="ctaButton" 
          onClick={() => handleNavLinkClick('community')}
          style={{ width: '100%', marginTop: '10px' }}
        >
          Join Network
        </button>
      </div>
    </>
  );
}
