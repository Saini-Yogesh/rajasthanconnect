import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import './Navbarcss.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbarScrolled' : ''}`}>
        <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <Compass className="logoIcon" size={32} color="var(--color-primary)" />
          <span>Rajasthan<span className="logoSpan">Connect</span></span>
        </Link>

        <div className="navLinks">
          <Link to="/cities" className={`navLink ${isActive('/cities') ? 'active' : ''}`}>
            Cities
          </Link>
          <Link to="/festivals" className={`navLink ${isActive('/festivals') ? 'active' : ''}`}>
            Festivals
          </Link>
          <Link to="/foods" className={`navLink ${isActive('/foods') ? 'active' : ''}`}>
            Cuisine
          </Link>
          <Link to="/history-culture" className={`navLink ${isActive('/history-culture') ? 'active' : ''}`}>
            History & Culture
          </Link>
          <Link to="/directory" className={`navLink ${isActive('/directory') ? 'active' : ''}`}>
            Directory
          </Link>
          <Link to="/planner" className={`navLink ${isActive('/planner') ? 'active' : ''} navLinkHighlight`}>
            <Sparkles size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
            AI Trip Planner
          </Link>
          <Link to="/ai-assistant" className={`navLink ${isActive('/ai-assistant') ? 'active' : ''} navLinkHighlight`}>
            <MessageCircle size={14} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
            Ask AI
          </Link>
          <Link to="/directory?register=true" className="ctaButton">
            Register Business
          </Link>
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
        <Link to="/cities" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          Cities
        </Link>
        <Link to="/festivals" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          Festivals
        </Link>
        <Link to="/foods" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          Cuisine
        </Link>
        <Link to="/history-culture" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          History & Culture
        </Link>
        <Link to="/directory" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          Directory
        </Link>
        <Link to="/planner" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          AI Trip Planner
        </Link>
        <Link to="/ai-assistant" className="mobileMenuLink" onClick={() => setMobileMenuOpen(false)}>
          Ask AI
        </Link>
        <Link to="/directory?register=true" className="ctaButton" style={{ width: '100%', marginTop: '10px' }} onClick={() => setMobileMenuOpen(false)}>
          Register Business
        </Link>
      </div>
    </>
  );
}
