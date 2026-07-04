import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { API_BASE_URL } from '../../config/api.js';
import './HistoryCulture.css';
import useSEO from '../../hooks/useSEO';
import { LIST_SEO } from '../../utils/seo';

// Subcomponents
import DynastiesPanel from './components/DynastiesPanel';
import ArtsPanel from './components/ArtsPanel';
import EtiquettePanel from './components/EtiquettePanel';

export default function HistoryCulture() {
  useSEO(LIST_SEO.historyCulture);

  const [cultureTopics, setCultureTopics] = useState([]);
  const [rulers, setRulers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dynasties');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/culture`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/history`).then(res => res.json())
    ])
      .then(([cultureData, rulersData]) => {
        setCultureTopics(cultureData);
        setRulers(rulersData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load history/culture details:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="culturePage">
      <header className="cultureHeader">
        <div className="headerContent">
          <h1>History & Cultural Heritage</h1>
          <p>Chronicles of Rajput dynasties, profiles of iconic kings, and guides on folk dances, clothing, and custom etiquettes.</p>
        </div>
      </header>

      {/* Chapters selection tab */}
      <div className="cultureTabsBar">
        <button 
          className={`tabBtn ${activeSection === 'dynasties' ? 'active' : ''}`}
          onClick={() => setActiveSection('dynasties')}
        >
          🏰 Rajput Dynasties & Kings
        </button>
        <button 
          className={`tabBtn ${activeSection === 'arts' ? 'active' : ''}`}
          onClick={() => setActiveSection('arts')}
        >
          💃 Folk Arts & Attire
        </button>
        <button 
          className={`tabBtn ${activeSection === 'etiquette' ? 'active' : ''}`}
          onClick={() => setActiveSection('etiquette')}
        >
          🤝 Cultural Etiquette & Pilgrimage
        </button>
      </div>

      <div className="cultureMainContent">
        {loading ? (
          <div className="cultureLoading">
            <Compass className="spinner" size={48} />
            <p>Uncovering royal archives and scripts...</p>
          </div>
        ) : (
          <div className="panelsContainer">
            {activeSection === 'dynasties' && (
              <DynastiesPanel rulers={rulers} />
            )}

            {activeSection === 'arts' && (
              <ArtsPanel cultureTopics={cultureTopics} />
            )}

            {activeSection === 'etiquette' && (
              <EtiquettePanel />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
