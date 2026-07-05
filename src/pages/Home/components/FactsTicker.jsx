import React from "react";
import { Zap } from "lucide-react";

const FUN_FACTS = [
  {
    emoji: "🏰",
    fact: "Rajasthan has more forts and palaces than any other state in India — over 400!",
  },
  {
    emoji: "🐪",
    fact: "The Pushkar Camel Fair is the world's largest camel trading fair, drawing 50,000+ camels annually.",
  },
  {
    emoji: "🌵",
    fact: "The Thar Desert covers 60% of Rajasthan and is the world's 9th largest hot desert.",
  },
  {
    emoji: "🎨",
    fact: "Block printing from Bagru & Sanganer is 500+ years old — each block is carved by hand.",
  },
  {
    emoji: "💎",
    fact: "Jaipur is called the 'Gem Capital of the World' — 90% of the world's gemstones are cut here.",
  },
  {
    emoji: "🦚",
    fact: "Rajasthan has more species of migratory birds than any other Indian state — 450+ species!",
  },
  {
    emoji: "🌅",
    fact: "Sam Sand Dunes near Jaisalmer shift by up to 30 feet per year due to desert winds.",
  },
  {
    emoji: "🏺",
    fact: "The Blue Pottery of Jaipur uses no clay — it is made from quartz, glass, and borax!",
  },
  {
    emoji: "🎭",
    fact: "Kathputli (string puppet) theatre of Rajasthan is over 1,000 years old — older than Shakespeare.",
  },
  {
    emoji: "🐅",
    fact: "Ranthambore is home to India's most fearless tigers — they are seen in broad daylight!",
  },
  {
    emoji: "🌊",
    fact: "Rajasthan was once completely under the Tethys Ocean — marine fossils are found in the desert!",
  },
  {
    emoji: "🕌",
    fact: "The Dilwara Jain Temples at Mt. Abu took 1,500 craftsmen over 14 years to complete.",
  },
  {
    emoji: "🎶",
    fact: "The Manganiyar and Langa musicians have performed at Carnegie Hall and the Royal Albert Hall.",
  },
  {
    emoji: "🏇",
    fact: "Maharana Pratap's horse Chetak has more statues in Rajasthan than any historical figure.",
  },
  {
    emoji: "🌺",
    fact: "Gangaur festival sees Rajasthani women fast for 18 days straight — for the health of their husbands.",
  },
  {
    emoji: "🔭",
    fact: "Jantar Mantar in Jaipur is a UNESCO site — its sundial is accurate to within 2 seconds!",
  },
  {
    emoji: "🧵",
    fact: "A single Bandhani (tie-dye) dupatta can have up to 75,000 individual hand-tied knots.",
  },
  {
    emoji: "🦅",
    fact: "The Great Indian Bustard — India's heaviest flying bird — lives only in the Thar desert.",
  },
  {
    emoji: "🌙",
    fact: "Udaipur's Pichola Lake was built in 1362 AD — it has never fully dried in 660+ years!",
  },
  {
    emoji: "🏹",
    fact: "Maharana Pratap fought the Battle of Haldighati with only 22,000 soldiers against 80,000.",
  },
];

export default function FactsTicker({
  activeFact,
  setActiveFact,
  setIsFactTickerHovered,
}) {
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  const minSwipeDistance = 50;

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setActiveFact((prev) => (prev - 1 + FUN_FACTS.length) % FUN_FACTS.length);
      } else if (e.key === "ArrowRight") {
        setActiveFact((prev) => (prev + 1) % FUN_FACTS.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveFact]);

  // Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveFact((prev) => (prev + 1) % FUN_FACTS.length);
    } else if (isRightSwipe) {
      setActiveFact((prev) => (prev - 1 + FUN_FACTS.length) % FUN_FACTS.length);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="factsTickerBar"
      onMouseEnter={() => setIsFactTickerHovered(true)}
      onMouseLeave={() => setIsFactTickerHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveFact((prev) => (prev - 1 + FUN_FACTS.length) % FUN_FACTS.length);
        }}
        aria-label="Previous fact"
        className="tickerArrowBtn left"
      >
        &larr;
      </button>

      <div className="tickerContent">
        <div className="tickerLabel">
          <Zap size={14} /> WOW FACT
        </div>
        <div className="tickerTextContainer">
          <span className="tickerEmoji">{FUN_FACTS[activeFact]?.emoji}</span>
          <span className="tickerText">{FUN_FACTS[activeFact]?.fact}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveFact((prev) => (prev + 1) % FUN_FACTS.length);
        }}
        aria-label="Next fact"
        className="tickerArrowBtn right"
      >
        &rarr;
      </button>

      <div className="tickerDots">
        {FUN_FACTS.map((_, idx) => (
          <button
            key={idx}
            className={`tickerDot ${idx === activeFact ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveFact(idx);
            }}
            aria-label={`Go to fact ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export { FUN_FACTS };
