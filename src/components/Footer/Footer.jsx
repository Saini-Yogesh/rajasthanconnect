import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Heart, Twitter, Facebook, Instagram } from 'lucide-react';
import './Footercss.css';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}!\nWe will send you monthly Rajasthan travel updates.`);
    setEmail('');
  };

  return (
    <footer className="footerContainer">
      <div className="footerGrid">
        
        {/* Brand Info */}
        <div className="footerBrand">
          <div className="footerLogo">
            <Compass className="logoIcon" size={28} color="var(--color-primary)" />
            <span>Rajasthan<span className="footerLogoSpan">Connect</span></span>
          </div>
          <p className="footerDesc">
            rajasthanconnect.in is a dedicated platform designed to bridge heritage, local tourism providers, 
            and global travelers, making the golden experience of Rajasthan accessible to everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footerColTitle">Quick Links</h4>
          <ul className="footerLinks">
            <li className="footerLinkItem"><Link to="/cities">Explore Cities</Link></li>
            <li className="footerLinkItem"><Link to="/history-culture">History & Culture</Link></li>
            <li className="footerLinkItem"><Link to="/directory">Local Providers</Link></li>
            <li className="footerLinkItem"><Link to="/directory?register=true">Register Listing</Link></li>
          </ul>
        </div>

        {/* Help & Resources */}
        <div>
          <h4 className="footerColTitle">Help & Resources</h4>
          <ul className="footerLinks">
            <li className="footerLinkItem"><Link to="/history-culture">Cultural Etiquette</Link></li>
            <li className="footerLinkItem"><Link to="/history-culture">Festival Calendar</Link></li>
            <li className="footerLinkItem"><Link to="/ai-assistant">Ask AI Assistant</Link></li>
            <li className="footerLinkItem"><Link to="/planner">AI Trip Planner</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="footerColTitle">Stay Updated</h4>
          <p className="newsletterText">
            Subscribe to our newsletter to receive curated itineraries, local stories, and exclusive guide events.
          </p>
          <form onSubmit={handleSubscribe} className="newsletterForm">
            <input 
              type="email" 
              className="newsletterInput" 
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletterBtn" aria-label="Subscribe">
              <Mail size={16} />
            </button>
          </form>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footerBottom">
        <div>
          © 2026 rajasthanconnect.in. Created with <Heart size={12} color="var(--color-primary)" fill="var(--color-primary)" style={{ display: 'inline-block', verticalAlign: 'middle' }} /> for the royal state.
        </div>

        <div className="socialRow">
          <a href="https://twitter.com" className="socialIcon" aria-label="Twitter"><Twitter size={18} /></a>
          <a href="https://facebook.com" className="socialIcon" aria-label="Facebook"><Facebook size={18} /></a>
          <a href="https://instagram.com" className="socialIcon" aria-label="Instagram"><Instagram size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
