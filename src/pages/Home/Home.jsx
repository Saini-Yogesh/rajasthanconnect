import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, BookOpen, Sparkles, ListCollapse, Utensils, Calendar,
  Play, Pause, Volume2, HelpCircle, RefreshCw, MapPin, CheckCircle, XCircle,
  Music, Palette, Crown, Star, Flame, Moon, Sun, Wind, Zap
} from 'lucide-react';
import './Home.css';

// Rotating trivia facts for the Did You Know card
const TRIVIA_FACTS = [
  "Jaipur was painted pink in 1876 to welcome Prince Albert. The city has kept this colour for 150+ years!",
  "Bhangarh Fort is India's only legally haunted place — the ASI bans entry after sunset by law.",
  "Jaisalmer Fort is one of the world's only 'living forts' — 3,000 people still live inside its 12th-century walls!",
  "Mehrangarh Fort walls still bear visible cannonball scars from battles fought over 500 years ago.",
  "Udaipur's Lake Palace appears to float on water — it was built entirely of white marble in 1743 AD.",
];

// 20 WOW fun facts for the animated ticker
const FUN_FACTS = [
  { emoji: "🏰", fact: "Rajasthan has more forts and palaces than any other state in India — over 400!" },
  { emoji: "🐪", fact: "The Pushkar Camel Fair is the world's largest camel trading fair, drawing 50,000+ camels annually." },
  { emoji: "🌵", fact: "The Thar Desert covers 60% of Rajasthan and is the world's 9th largest hot desert." },
  { emoji: "🎨", fact: "Block printing from Bagru & Sanganer is 500+ years old — each block is carved by hand." },
  { emoji: "💎", fact: "Jaipur is called the 'Gem Capital of the World' — 90% of the world's gemstones are cut here." },
  { emoji: "🦚", fact: "Rajasthan has more species of migratory birds than any other Indian state — 450+ species!" },
  { emoji: "🌅", fact: "Sam Sand Dunes near Jaisalmer shift by up to 30 feet per year due to desert winds." },
  { emoji: "🏺", fact: "The Blue Pottery of Jaipur uses no clay — it is made from quartz, glass, and borax!" },
  { emoji: "🎭", fact: "Kathputli (string puppet) theatre of Rajasthan is over 1,000 years old — older than Shakespeare." },
  { emoji: "🐅", fact: "Ranthambore is home to India's most fearless tigers — they are seen in broad daylight!" },
  { emoji: "🌊", fact: "Rajasthan was once completely under the Tethys Ocean — marine fossils are found in the desert!" },
  { emoji: "🕌", fact: "The Dilwara Jain Temples at Mt. Abu took 1,500 craftsmen over 14 years to complete." },
  { emoji: "🎶", fact: "The Manganiyar and Langa musicians have performed at Carnegie Hall and the Royal Albert Hall." },
  { emoji: "🏇", fact: "Maharana Pratap's horse Chetak has more statues in Rajasthan than any historical figure." },
  { emoji: "🌺", fact: "Gangaur festival sees Rajasthani women fast for 18 days straight — for the health of their husbands." },
  { emoji: "🔭", fact: "Jantar Mantar in Jaipur is a UNESCO site — its sundial is accurate to within 2 seconds!" },
  { emoji: "🧵", fact: "A single Bandhani (tie-dye) dupatta can have up to 75,000 individual hand-tied knots." },
  { emoji: "🦅", fact: "The Great Indian Bustard — India's heaviest flying bird — lives only in the Thar desert." },
  { emoji: "🌙", fact: "Udaipur's Pichola Lake was built in 1362 AD — it has never fully dried in 660+ years!" },
  { emoji: "🏹", fact: "Maharana Pratap fought the Battle of Haldighati with only 22,000 soldiers against 80,000." },
];

// Cultural highlights data
const CULTURAL_HIGHLIGHTS = [
  {
    icon: Music,
    color: "#c2410c",
    bg: "#fff7ed",
    title: "Folk Music Traditions",
    subtitle: "Manganiyar · Kalbeliya · Langas",
    desc: "The desert songs of Rajasthan have been performed for royalty for 800 years. Manganiyar musicians use a single khamaycha to produce sounds rivaling a full orchestra.",
    badge: "UNESCO Intangible Heritage",
  },
  {
    icon: Palette,
    color: "#b45309",
    bg: "#fef9c3",
    title: "Living Art Forms",
    subtitle: "Miniature Painting · Phad · Pichwai",
    desc: "Rajasthani miniature paintings use gold leaf and natural pigments made from precious stones. A single Pichwai painting can take 6–18 months of continuous work.",
    badge: "2,000-Year Tradition",
  },
  {
    icon: Crown,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Royal Attire & Jewels",
    subtitle: "Pagri · Ghagra Choli · Kundan",
    desc: "A Rajput groom's wedding pagri (turban) is tied fresh each morning — it has 1,001 folds representing each virtue of valour. Kundan jewellery is set with uncut gemstones in 24K gold.",
    badge: "Royalty Since 700 AD",
  },
  {
    icon: Wind,
    color: "#0369a1",
    bg: "#f0f9ff",
    title: "Performing Arts",
    subtitle: "Kathputli · Bhavai · Chari Dance",
    desc: "Kathputli puppet shows narrate legends of Amar Singh Rathore. Chari dancers balance lit pots on their heads while performing — with zero rehearsal safety nets!",
    badge: "Street Theatre Since 900 AD",
  },
];

// Festivals & Sacred Fasting data
const FESTIVALS_DATA = [
  {
    month: "JAN–FEB",
    name: "Desert Festival",
    city: "Jaisalmer",
    color: "#c2410c",
    description: "Camel races, turban-tying contests, and folk performances against the golden dunes of Sam.",
    tags: ["Camel Race", "Folk Dance", "3 Days"],
  },
  {
    month: "MAR–APR",
    name: "Gangaur Festival",
    city: "Jaipur · Udaipur",
    color: "#7c3aed",
    description: "Women observe 18 days of fasting worshipping Goddess Gauri for the wellbeing of their husbands. Colourful processions wind through royal cities.",
    tags: ["18-Day Fast", "Procession", "Goddess Gauri"],
  },
  {
    month: "AUG",
    name: "Teej Festival",
    city: "Statewide",
    color: "#065f46",
    description: "The monsoon festival of swings! Women in green lehengas celebrate Parvati's reunion with Shiva. A sacred fast marks this joyful occasion.",
    tags: ["Monsoon", "Sacred Fast", "Swings & Songs"],
  },
  {
    month: "OCT–NOV",
    name: "Pushkar Camel Fair",
    city: "Pushkar",
    color: "#b45309",
    description: "The world's largest camel fair — 50,000 camels, trading, hot air balloons over the lake, and the holiest Brahma Temple bath.",
    tags: ["World's Largest", "Camel Trade", "Holy Dip"],
  },
  {
    month: "OCT–NOV",
    name: "Diwali in Udaipur",
    city: "Udaipur",
    color: "#9f1239",
    description: "The City of Lakes glows with 10,000 oil lamps reflected across Pichola. Fireworks from the Lake Palace make this the most photogenic Diwali in India.",
    tags: ["10,000 Diyas", "Lake Reflection", "Fireworks"],
  },
  {
    month: "MAR",
    name: "Holi at Barsana",
    city: "Bharatpur region",
    color: "#be185d",
    description: "Lathmar Holi — women chase men with sticks while they shield themselves with shields. This 5,000-year tradition is the most energetic Holi in all of India!",
    tags: ["Lathmar", "5,000 Yr Tradition", "2 Days"],
  },
];

// Interactive Map Pins
const MAP_CITIES = [
  { id: 'jaipur', name: 'Jaipur', x: 75, y: 35, tagline: 'The Pink City', desc: 'Explore Hawa Mahal, Amber Fort and local markets.' },
  { id: 'jodhpur', name: 'Jodhpur', x: 45, y: 48, tagline: 'The Blue City', desc: 'Home of Mehrangarh Fort and iconic blue houses.' },
  { id: 'udaipur', name: 'Udaipur', x: 40, y: 75, tagline: 'City of Lakes', desc: 'Famous for floating marble palaces and Pichola sunsets.' },
  { id: 'jaisalmer', name: 'Jaisalmer', x: 15, y: 40, tagline: 'The Golden Fort', desc: 'Discover Sonar Qila and desert safaris at Sam Dunes.' },
  { id: 'pushkar', name: 'Pushkar', x: 55, y: 52, tagline: 'The Holy Town', desc: 'Sacred lakes, Brahma Temple, and the giant Camel Fair.' },
];

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [activeTrivia, setActiveTrivia] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const nodesRef = useRef([]);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeFact, setActiveFact] = useState(0);

  // Greeting
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Khamma Ghani! Suprabhat (Good Morning)');
    else if (h < 17) setGreeting('Khamma Ghani! Dopehar Shubh (Good Afternoon)');
    else setGreeting('Khamma Ghani! Shubh Sandhya (Good Evening)');
  }, []);

  // Auto rotate trivia
  useEffect(() => {
    const t = setInterval(() => setActiveTrivia(p => (p + 1) % TRIVIA_FACTS.length), 8000);
    return () => clearInterval(t);
  }, []);

  // Auto rotate fun fact ticker
  useEffect(() => {
    const t = setInterval(() => setActiveFact(p => (p + 1) % FUN_FACTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Web Audio API — Tanpura drone synthesizer
  const startDrone = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.5);
    master.connect(ctx.destination);

    // Sa, Pa, Sa' (tanpura strings: C2, G2, C3, C4)
    const strings = [65.41, 98.00, 130.81, 261.63];
    strings.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;
      lfo.type = 'sine';
      lfo.frequency.value = 0.5 + i * 0.3;
      lfoGain.gain.value = 1.5;

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.value = [0.5, 0.4, 0.35, 0.3][i];
      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + i * 0.5);
      lfo.start();
      nodesRef.current.push(osc, lfo);
    });

    setIsPlayingAudio(true);
    timerRef.current = setTimeout(() => stopDrone(), 30000);
  };

  const stopDrone = () => {
    if (audioCtxRef.current) {
      const master = audioCtxRef.current.createGain();
      master.gain.setValueAtTime(0.4, audioCtxRef.current.currentTime);
      master.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
      nodesRef.current.forEach(n => { try { n.stop(audioCtxRef.current.currentTime + 1.5); } catch(e){} });
      nodesRef.current = [];
      setTimeout(() => { try { audioCtxRef.current?.close(); audioCtxRef.current = null; } catch(e){} }, 2000);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlayingAudio(false);
  };

  const toggleAudio = () => isPlayingAudio ? stopDrone() : startDrone();

  useEffect(() => () => { stopDrone(); }, []);

  const handleQuizAnswer = (idx) => { setSelectedOption(idx); setQuizAnswered(idx === 2 ? 'correct' : 'incorrect'); };
  const resetQuiz = () => { setQuizAnswered(null); setSelectedOption(null); };

  return (
    <div className="homeContainer">

      {/* ── HERO ── */}
      <header className="heroBanner">
        <div className="heroOverlay"></div>
        <div className="heroContent">
          <span className="heroPre">{greeting}</span>
          <h1>Rajasthan<span>Connect</span></h1>
          <div className="heroDivider"></div>
          <p>The digital encyclopedia of Rajasthan. Explore majestic forts, royal dynasties, local gourmet secrets, vibrant folk festivals, and connect directly with verified guides.</p>
          <div className="heroActions">
            <Link to="/cities" className="btnPrimary">Explore Cities</Link>
            <Link to="/planner" className="btnSecondary"><Sparkles size={16} /> AI Trip Planner</Link>
          </div>
        </div>
        <div className={`ambientAudioCard ${isPlayingAudio ? 'pulseSound' : ''}`}>
          <div className="audioInfo">
            <Volume2 className="audioIcon" size={20} />
            <div>
              <h5>Sound of Marwar</h5>
              <p>{isPlayingAudio ? 'Tanpura Drone Playing…' : 'Click to hear Rajasthani drone'}</p>
            </div>
          </div>
          <button onClick={toggleAudio} className="btnAudioPlay" aria-label="Toggle ambient sound">
            {isPlayingAudio ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </header>

      {/* ── WOW FACTS TICKER ── */}
      <div className="factsTickerBar">
        <div className="tickerLabel"><Zap size={14} /> WOW FACT</div>
        <div className="tickerContent">
          <span className="tickerEmoji">{FUN_FACTS[activeFact].emoji}</span>
          <span className="tickerText">{FUN_FACTS[activeFact].fact}</span>
        </div>
        <div className="tickerDots">
          {FUN_FACTS.map((_, i) => (
            <button key={i} className={`tickerDot ${i === activeFact ? 'active' : ''}`} onClick={() => setActiveFact(i)} />
          ))}
        </div>
      </div>

      {/* ── MAP & TRIVIA/QUIZ ── */}
      <section className="interactiveHubSection">
        <div className="hubGrid">
          <div className="hubCard mapPortalCard">
            <div className="cardHeader">
              <Compass className="headerIcon" />
              <h3>Interactive Kingdoms Map</h3>
              <p>Hover or tap on glowing nodes to preview Rajasthan's royal capitals.</p>
            </div>
            <div className="rajasthanMapCanvas">
              <div className="mapBackground"></div>
              {MAP_CITIES.map(city => (
                <Link to={`/cities/${city.id}`} key={city.id} className="mapPin"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}>
                  <MapPin size={24} className="pinIcon" />
                  <span className="pinPulse"></span>
                  <span className="pinLabel">{city.name}</span>
                </Link>
              ))}
              {hoveredCity && (
                <div className="mapPopup">
                  <h4>{hoveredCity.name}</h4>
                  <span className="popupTagline">{hoveredCity.tagline}</span>
                  <p>{hoveredCity.desc}</p>
                  <span className="popupLink">Explore Portal →</span>
                </div>
              )}
            </div>
          </div>

          <div className="hubColumn">
            <div className="hubCard triviaCard">
              <div className="cardHeader">
                <Sparkles className="headerIcon gold" />
                <h3>Did You Know?</h3>
                <span className="factCounter">Fact {activeTrivia + 1} of {TRIVIA_FACTS.length}</span>
              </div>
              <div className="triviaContentBox">
                <p className="triviaText">"{TRIVIA_FACTS[activeTrivia]}"</p>
              </div>
              <div className="triviaControls">
                {TRIVIA_FACTS.map((_, idx) => (
                  <button key={idx} className={`triviaDot ${idx === activeTrivia ? 'active' : ''}`}
                    onClick={() => setActiveTrivia(idx)} aria-label={`Show fact ${idx + 1}`} />
                ))}
              </div>
            </div>

            <div className="hubCard quizCard">
              <div className="cardHeader">
                <HelpCircle className="headerIcon" />
                <h3>Royal Quiz of the Day</h3>
              </div>
              <div className="quizContent">
                <p className="quizQuestion">Which Rajput king built the astronomical observatories (Jantar Mantar) in Jaipur and Delhi?</p>
                {quizAnswered === null ? (
                  <div className="quizOptionsList">
                    <button onClick={() => handleQuizAnswer(0)} className="btnQuizOption">A) Maharana Pratap</button>
                    <button onClick={() => handleQuizAnswer(1)} className="btnQuizOption">B) Rao Jodha</button>
                    <button onClick={() => handleQuizAnswer(2)} className="btnQuizOption">C) Maharaja Sawai Jai Singh II</button>
                    <button onClick={() => handleQuizAnswer(3)} className="btnQuizOption">D) Rawal Jaisal</button>
                  </div>
                ) : (
                  <div className="quizResult">
                    {quizAnswered === 'correct' ? (
                      <div className="resultBox correct">
                        <CheckCircle size={28} className="resultIcon" />
                        <h4>Khamma Ghani! Correct!</h4>
                        <p>Maharaja Sawai Jai Singh II founded Jaipur in 1727 and built 5 observatories across India.</p>
                      </div>
                    ) : (
                      <div className="resultBox incorrect">
                        <XCircle size={28} className="resultIcon" />
                        <h4>Incorrect — Try Again!</h4>
                        <p>Hint: He founded the Pink City of Jaipur in 1727 and was an astronomer-king.</p>
                      </div>
                    )}
                    <button onClick={resetQuiz} className="btnQuizReset"><RefreshCw size={14} /> Reset Quiz</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAL GRID ── */}
      <section className="portalGridSection">
        <div className="portalGridInner">
          <div className="sectionHeader">
            <h2>Encyclopedia Chapters</h2>
            <p>Select a portal below to dive deep into the land of kings.</p>
          </div>
          <div className="portalGrid">
            <Link to="/cities" className="portalCard">
              <div className="cardIcon"><Compass size={32} /></div>
              <h3>Cities &amp; Portals</h3>
              <p>Travel logs, weather info, maps, and local emergency directories for Jaipur, Jodhpur, Udaipur, and more.</p>
              <span className="cardLink">Explore Cities →</span>
            </Link>
            <Link to="/history-culture" className="portalCard">
              <div className="cardIcon"><BookOpen size={32} /></div>
              <h3>History &amp; Culture</h3>
              <p>Chronicles of Rajput dynasties, biographies of rulers like Maharana Pratap, traditional attire, and folk arts.</p>
              <span className="cardLink">View History →</span>
            </Link>
            <Link to="/directory" className="portalCard">
              <div className="cardIcon"><ListCollapse size={32} /></div>
              <h3>Local Provider Directory</h3>
              <p>Find licensed heritage walking tour guides, hotels, transport providers, and block-printing workshops.</p>
              <span className="cardLink">Open Directory →</span>
            </Link>
            <Link to="/planner" className="portalCard highlightCard">
              <div className="cardIcon"><Sparkles size={32} /></div>
              <h3>AI Sightseeing Planner</h3>
              <p>Generate a customized, day-by-day sightseeing timeline tailored to your budget, duration, and interests.</p>
              <span className="cardLink">Plan Your Trip →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOD & FESTIVALS BANNERS ── */}
      <section className="highlightSections">
        <div className="highlightInner">
          <div className="highlightGrid">
            <div className="highlightBanner foodBanner">
              <div className="bannerContent">
                <Utensils size={36} className="bannerIcon" />
                <h3>Rajasthani Gourmet</h3>
                <p>Discover historical recipes like Dal Baati Churma and fiery Laal Maas directly from Mewar royal kitchens.</p>
                <Link to="/foods/dal-baati-churma" className="bannerLink">Learn Recipes</Link>
              </div>
            </div>
            <div className="highlightBanner festivalBanner">
              <div className="bannerContent">
                <Calendar size={36} className="bannerIcon" />
                <h3>Cultural Festivals</h3>
                <p>Check the calendar dates, locations, travel tips, and dress codes for the Pushkar Fair and Gangaur Festival.</p>
                <Link to="/festivals/gangaur" className="bannerLink">View Festivals</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CULTURAL SPOTLIGHTS ── */}
      <section className="culturalSection">
        <div className="culturalInner">
          <div className="sectionHeader">
            <h2>Living Culture of Rajasthan</h2>
            <p>Ancient traditions that are still alive — passed from master to student for over a thousand years.</p>
          </div>
          <div className="culturalGrid">
            {CULTURAL_HIGHLIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div className="culturalCard" key={i} style={{ '--card-accent': item.color, '--card-bg': item.bg }}>
                  <div className="culturalIconBox" style={{ background: item.bg }}>
                    <Icon size={28} style={{ color: item.color }} />
                  </div>
                  <span className="culturalBadge" style={{ background: item.color }}>{item.badge}</span>
                  <h4>{item.title}</h4>
                  <p className="culturalSubtitle">{item.subtitle}</p>
                  <p className="culturalDesc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FESTIVALS & FASTING ── */}
      <section className="festivalsSection">
        <div className="festivalsInner">
          <div className="sectionHeader festivalHeader">
            <h2>Festivals &amp; Sacred Fasting</h2>
            <p>Every month brings a new reason to celebrate in Rajasthan — from camel races to moonlit fasting vigils.</p>
          </div>
          <div className="festivalsGrid">
            {FESTIVALS_DATA.map((f, i) => (
              <div className="festivalCard" key={i} style={{ '--fest-color': f.color }}>
                <div className="festMonthBadge" style={{ background: f.color }}>{f.month}</div>
                <div className="festCardBody">
                  <h4>{f.name}</h4>
                  <p className="festCity"><MapPin size={12} /> {f.city}</p>
                  <p className="festDesc">{f.description}</p>
                  <div className="festTags">
                    {f.tags.map((tag, j) => (
                      <span key={j} className="festTag" style={{ borderColor: f.color, color: f.color }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CALLOUT ── */}
      <section className="chatCallout">
        <div className="chatCalloutContent">
          <h2>Have questions about Rajasthan?</h2>
          <p>Ask our conversational AI assistant about translation phrases in Marwari, local etiquettes, and historic trivia.</p>
          <Link to="/ai-assistant" className="btnChat">Chat with AI Guide</Link>
        </div>
      </section>

    </div>
  );
}
