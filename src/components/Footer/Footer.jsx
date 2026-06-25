import React, { useState } from 'react';
import { Compass, Mail, Heart, Twitter, Facebook, Instagram } from 'lucide-react';
import './Footercss.css';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing with: ${email}!\nWe will send you monthly Rajasthan travel updates.`);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footerGrid">
        
        {/* Brand Info */}
        <div className="footerBrand">
          <div className="footerLogo">
            <Compass size={24} color="var(--color-primary)" />
            <span>Rajasthan<span className="footerLogoSpan">Connect</span></span>
          </div>
          <p className="footerDesc">
            rajasthanconnect.in is a dedicated platform designed to bridge heritage, local tourism providers, 
            and global travelers, making the golden experience of Rajasthan accessible to everyone.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="footerColTitle">Quick Links</h4>
          <ul className="footerLinks">
            <li className="footerLinkItem" onClick={() => onNavigate('explore')}>Explore Cities</li>
            <li className="footerLinkItem" onClick={() => onNavigate('crafts')}>Heritage & Crafts</li>
            <li className="footerLinkItem" onClick={() => onNavigate('directory')}>Local Providers</li>
            <li className="footerLinkItem" onClick={() => onNavigate('community')}>Register Listing</li>
          </ul>
        </div>

        {/* Help & Contact */}
        <div>
          <h4 className="footerColTitle">Help & Resources</h4>
          <ul className="footerLinks">
            <li className="footerLinkItem" onClick={() => onNavigate('community')}>Cultural Etiquette</li>
            <li className="footerLinkItem" onClick={() => onNavigate('community')}>Festival Calendar</li>
            <li className="footerLinkItem">Tourism Guidelines</li>
            <li className="footerLinkItem">Support Desk</li>
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
          <div className="socialBtn" aria-label="Twitter">
            <Twitter size={16} />
          </div>
          <div className="socialBtn" aria-label="Facebook">
            <Facebook size={16} />
          </div>
          <div className="socialBtn" aria-label="Instagram">
            <Instagram size={16} />
          </div>
        </div>
      </div>
    </footer>
  );
}
