import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Compass,
  Menu,
  X,
  Sparkles,
  MessageCircle,
  ChevronDown,
  MapPin,
  BookOpen,
  Music,
  Palette,
  Utensils,
  Calendar,
  Crown,
  Globe,
  Users,
  Star,
  Building,
  ScrollText,
  Gem,
  ShieldCheck,
} from "lucide-react";
import "./Navbarcss.css";

// ─── Mega-menu groups ────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Explore",
    id: "explore",
    items: [
      { to: "/cities", icon: MapPin, label: "Royal Cities", desc: "Jaipur, Jodhpur, Udaipur & more" },
      { to: "/districts", icon: Building, label: "Districts", desc: "All 33 districts of Rajasthan" },
      { to: "/places", icon: Compass, label: "Places & Forts", desc: "Heritage sites and landmarks" },
      { to: "/experiences", icon: Star, label: "Unique Experiences", desc: "Desert safaris, palace stays" },
      { to: "/royal-weddings", icon: Crown, label: "Royal Wedding Venues", desc: "Palaces & heritage venues" },
      { to: "/unesco-sites", icon: Globe, label: "UNESCO Sites", desc: "World heritage treasures" },
    ],
  },
  {
    label: "Culture & History",
    id: "culture",
    items: [
      { to: "/history-culture", icon: BookOpen, label: "History & Dynasties", desc: "Rulers, battles, timelines" },
      { to: "/dynasties", icon: Crown, label: "Royal Dynasties", desc: "Mewar, Marwar, Dhundhar" },
      { to: "/events", icon: ScrollText, label: "Historical Events", desc: "Key battles & milestones" },
      { to: "/festivals", icon: Calendar, label: "Festivals & Melas", desc: "Pushkar, Gangaur, Teej" },
      { to: "/folk-arts", icon: Palette, label: "Folk Arts", desc: "Ghoomar, Kathputli, Phad" },
      { to: "/folk-music", icon: Music, label: "Folk Music & Instruments", desc: "Manganiyar, Khamaycha" },
    ],
  },
  {
    label: "Craft & Heritage",
    id: "craft",
    items: [
      { to: "/handicrafts", icon: Gem, label: "Handicrafts", desc: "Blue pottery, block printing" },
      { to: "/attire", icon: ShieldCheck, label: "Traditional Attire", desc: "Pagri, Ghagra Choli, Bandhani" },
      { to: "/foods", icon: Utensils, label: "Royal Cuisine", desc: "Dal Baati, Laal Maas" },
      { to: "/languages", icon: Globe, label: "Languages", desc: "Marwari, Mewari, Dhundhari" },
      { to: "/communities", icon: Users, label: "Communities & Tribes", desc: "Bhils, Meenas, Rajputs" },
    ],
  },
];

const NAV_STANDALONE = [
  { to: "/directory", label: "Directory" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);
  const closeTimerRef = useRef(null);

  const openGroup = (groupId) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveGroup(groupId);
  };

  const scheduleCloseGroup = () => {
    closeTimerRef.current = setTimeout(() => setActiveGroup(null), 180);
  };

  // Scroll handler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega-menu on route change
  useEffect(() => {
    setActiveGroup(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  // Click outside to close mega-menu
  useEffect(() => {
    const onClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveGroup(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const isGroupActive = (group) =>
    group.items.some((item) => isActive(item.to));

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? "navbarScrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <Compass className="logoIcon" size={30} color="var(--color-primary)" />
          <span className="logoText">
            Rajasthan<span className="logoSpan">Connect</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="navLinks">
          {NAV_GROUPS.map((group) => (
            <div
              key={group.id}
              className="navDropdownTrigger"
              onMouseEnter={() => openGroup(group.id)}
              onMouseLeave={scheduleCloseGroup}
            >
              <button
                className={`navLink navDropdownBtn ${isGroupActive(group) ? "active" : ""}`}
                aria-expanded={activeGroup === group.id}
                aria-haspopup="true"
              >
                {group.label}
                <ChevronDown
                  size={14}
                  className={`chevron ${activeGroup === group.id ? "chevronOpen" : ""}`}
                />
              </button>

              {/* Mega-menu panel */}
              <div
                className={`megaMenu ${activeGroup === group.id ? "megaMenuOpen" : ""}`}
                role="menu"
              >
                <div className="megaMenuGrid">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`megaMenuItem ${isActive(item.to) ? "megaMenuItemActive" : ""}`}
                        role="menuitem"
                      >
                        <span className="megaMenuIcon">
                          <Icon size={16} />
                        </span>
                        <span className="megaMenuText">
                          <span className="megaMenuLabel">{item.label}</span>
                          <span className="megaMenuDesc">{item.desc}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {NAV_STANDALONE.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`navLink ${isActive(item.to) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/planner"
            className={`navLink navLinkHighlight ${isActive("/planner") ? "active" : ""}`}
          >
            <Sparkles size={14} aria-hidden="true" />
            AI Planner
          </Link>

          <Link
            to="/ai-assistant"
            className={`navLink navLinkHighlight ${isActive("/ai-assistant") ? "active" : ""}`}
          >
            <MessageCircle size={14} aria-hidden="true" />
            Ask AI
          </Link>

          <Link to="/directory?register=true" className="ctaButton">
            Register Business
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="mobileMenuBtn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobileMenu ${mobileOpen ? "mobileMenuOpen" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobileMenuScroll">
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="mobileGroup">
              <button
                className="mobileGroupBtn"
                onClick={() =>
                  setMobileExpanded(mobileExpanded === group.id ? null : group.id)
                }
                aria-expanded={mobileExpanded === group.id}
              >
                {group.label}
                <ChevronDown
                  size={16}
                  className={`chevron ${mobileExpanded === group.id ? "chevronOpen" : ""}`}
                />
              </button>
              {mobileExpanded === group.id && (
                <div className="mobileGroupItems">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`mobileMenuLink ${isActive(item.to) ? "active" : ""}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon size={14} aria-hidden="true" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {NAV_STANDALONE.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`mobileMenuLink ${isActive(item.to) ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/planner"
            className="mobileMenuLink mobileHighlight"
            onClick={() => setMobileOpen(false)}
          >
            <Sparkles size={14} aria-hidden="true" /> AI Planner
          </Link>
          <Link
            to="/ai-assistant"
            className="mobileMenuLink mobileHighlight"
            onClick={() => setMobileOpen(false)}
          >
            <MessageCircle size={14} aria-hidden="true" /> Ask AI
          </Link>
          <Link
            to="/directory?register=true"
            className="ctaButton mobileCta"
            onClick={() => setMobileOpen(false)}
          >
            Register Business
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="mobileBackdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
