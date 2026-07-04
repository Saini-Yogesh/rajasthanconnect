/**
 * Centralized SEO helpers — keyword-rich titles, descriptions, and JSON-LD
 * tuned for Rajasthan travel searches (city + Rajasthan, food, festivals, etc.)
 */

export const SITE = {
  name: "Rajasthan Connect",
  url: (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) || "https://www.rajasthanconnect.in",
  defaultImage: "https://www.rajasthanconnect.in/images/jaipur.webp",
  locale: "en_IN",
  region: "Rajasthan",
};

const YEAR = new Date().getFullYear();

export function buildUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean === "/" ? "" : clean}${clean === "/" ? "/" : ""}`.replace(
    /([^:]\/)\/+/g,
    "$1"
  );
}

export function truncateDesc(text, max = 155) {
  if (!text) return "";
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max - 3);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "...";
}

export function buildKeywords(...terms) {
  const base = [
    "Rajasthan",
    "Rajasthan tourism",
    "Rajasthan travel guide",
    "Rajasthan India",
    "Land of Kings",
  ];
  const all = [...terms.flat().filter(Boolean), ...base];
  return [...new Set(all.map((t) => String(t).trim()))].join(", ");
}

function breadcrumbSchema(crumbs) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

function collectionSchema({ name, description, url }) {
  return {
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

function articleSchema({ name, description, url, image }) {
  return {
    "@type": "Article",
    headline: name,
    description,
    url,
    image: image || SITE.defaultImage,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: SITE.defaultImage },
    },
  };
}

function touristDestinationSchema({ name, description, url, image }) {
  return {
    "@type": "TouristDestination",
    name,
    description,
    url,
    image: image || SITE.defaultImage,
    containedInPlace: {
      "@type": "State",
      name: "Rajasthan",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
    },
  };
}

function landmarkSchema({ name, description, url, image, city }) {
  return {
    "@type": "LandmarksOrHistoricalBuildings",
    name,
    description,
    url,
    image: image || SITE.defaultImage,
    ...(city && {
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
    }),
  };
}

function eventSchema({ name, description, url, image, location }) {
  return {
    "@type": "Event",
    name,
    description,
    url,
    image: image || SITE.defaultImage,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: location || "Rajasthan, India",
      address: { "@type": "PostalAddress", addressRegion: "Rajasthan", addressCountry: "IN" },
    },
  };
}

function recipeSchema({ name, description, url, image }) {
  return {
    "@type": "Recipe",
    name,
    description,
    url,
    image: image || SITE.defaultImage,
    recipeCuisine: "Rajasthani",
    author: { "@type": "Organization", name: SITE.name },
  };
}

function graph(...nodes) {
  return { "@context": "https://schema.org", "@graph": nodes.flat().filter(Boolean) };
}

function listPage({ title, description, keywords, path, collectionName }) {
  const url = buildUrl(path);
  return {
    title,
    description: truncateDesc(description),
    keywords,
    url,
    image: SITE.defaultImage,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: collectionName, url },
      ]),
      collectionSchema({ name: collectionName, description, url })
    ),
  };
}

/* ─── Static list routes ─────────────────────────────────────────────────── */

export const LIST_SEO = {
  home: {
    title: `Rajasthan Tourism ${YEAR} — Cities, Festivals & Travel Guide`,
    description:
      "Explore Rajasthan — 48+ cities, 76+ festivals, 70+ dishes, UNESCO forts & verified local guides. Plan Jaipur, Udaipur, Jaisalmer trips with AI tools.",
    keywords: buildKeywords(
      "Rajasthan tourism",
      "Rajasthan travel guide",
      "Jaipur Udaipur Jaisalmer",
      "Rajasthan festivals",
      "Rajasthani food",
      "things to do Rajasthan",
      "Rajasthan trip planner"
    ),
    url: SITE.url,
    schema: graph(
      {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        description: "Rajasthan tourism portal — cities, culture, food, festivals & travel planning.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      touristDestinationSchema({
        name: "Rajasthan, India",
        description: "The Land of Kings — desert forts, royal palaces, folk arts and vibrant festivals.",
        url: SITE.url,
      })
    ),
  },

  cities: listPage({
    title: "Rajasthan Cities — Jaipur, Udaipur, Jodhpur & 48+ Destinations",
    description:
      "Complete guide to Rajasthan cities — Jaipur Pink City, Udaipur lakes, Jodhpur Blue City, Jaisalmer golden dunes, Pushkar & more. Travel tips & local guides.",
    keywords: buildKeywords(
      "Rajasthan cities",
      "Jaipur Rajasthan",
      "Udaipur Rajasthan",
      "Jodhpur Rajasthan",
      "Jaisalmer Rajasthan",
      "Pushkar Rajasthan",
      "best cities Rajasthan",
      "Rajasthan places to visit"
    ),
    path: "/cities",
    collectionName: "Cities of Rajasthan",
  }),

  places: listPage({
    title: "Rajasthan Forts & Palaces — Amber, Mehrangarh, Chittorgarh",
    description:
      "137+ heritage places in Rajasthan — Amber Fort, Mehrangarh, Hawa Mahal, Lake Palace, Chittorgarh, Jantar Mantar. Timings, history & travel tips.",
    keywords: buildKeywords(
      "Rajasthan forts",
      "Rajasthan palaces",
      "Amber Fort Jaipur",
      "Mehrangarh Fort Jodhpur",
      "Hawa Mahal",
      "Chittorgarh Fort",
      "places to visit Rajasthan",
      "Rajasthan monuments"
    ),
    path: "/places",
    collectionName: "Heritage Places in Rajasthan",
  }),

  districts: listPage({
    title: "All 33 Districts of Rajasthan — Complete District Guide",
    description:
      "Explore all 33 districts of Rajasthan — Jaipur, Jodhpur, Udaipur, Jaisalmer, Barmer, Bikaner, Alwar & more. Desert, hills, lakes & sacred towns.",
    keywords: buildKeywords(
      "Rajasthan districts",
      "33 districts Rajasthan",
      "Jaipur district",
      "Jodhpur district",
      "Udaipur district",
      "Rajasthan map districts"
    ),
    path: "/districts",
    collectionName: "Districts of Rajasthan",
  }),

  foods: listPage({
    title: "Rajasthani Food — Dal Baati, Laal Maas & Royal Recipes",
    description:
      "70+ authentic Rajasthani dishes — Dal Baati Churma, Laal Maas, Gatte ki Sabzi, Ker Sangri, Ghevar. Recipes, history & where to eat in Rajasthan.",
    keywords: buildKeywords(
      "Rajasthani food",
      "Rajasthani cuisine",
      "Dal Baati Churma",
      "Laal Maas recipe",
      "Rajasthani sweets",
      "traditional Rajasthani food",
      "what to eat in Rajasthan"
    ),
    path: "/foods",
    collectionName: "Rajasthani Cuisine",
  }),

  festivals: listPage({
    title: "Rajasthan Festivals — Pushkar Fair, Gangaur, Desert Festival",
    description:
      "76+ Rajasthan festivals — Pushkar Camel Fair, Gangaur, Teej, Desert Festival Jaisalmer, Holi Barsana. Dates, locations, dress codes & travel tips.",
    keywords: buildKeywords(
      "Rajasthan festivals",
      "Pushkar Camel Fair",
      "Gangaur festival",
      "Desert Festival Jaisalmer",
      "Teej festival Rajasthan",
      "Holi Barsana",
      "Rajasthan cultural festivals"
    ),
    path: "/festivals",
    collectionName: "Festivals of Rajasthan",
  }),

  historyCulture: listPage({
    title: "Rajasthan History & Culture — Dynasties, Rulers & Folk Arts",
    description:
      "Royal history of Rajasthan — Mewar, Marwar, Dhundhar dynasties, Maharana Pratap, Rajput valour, Ghoomar, folk arts, attire & living traditions.",
    keywords: buildKeywords(
      "Rajasthan history",
      "Rajput history",
      "Mewar dynasty",
      "Marwar dynasty",
      "Rajasthan culture",
      "Rajasthani folk arts",
      "Maharana Pratap"
    ),
    path: "/history-culture",
    collectionName: "History & Culture of Rajasthan",
  }),

  handicrafts: listPage({
    title: "Rajasthan Handicrafts — Blue Pottery, Bandhani & Meenakari",
    description:
      "40+ Rajasthan handicrafts — Jaipur blue pottery, Bagru block printing, Bandhani tie-dye, Meenakari jewellery, marble inlay. Artisan traditions & workshops.",
    keywords: buildKeywords(
      "Rajasthan handicrafts",
      "blue pottery Jaipur",
      "Bandhani Rajasthan",
      "Meenakari jewellery",
      "block printing Bagru",
      "Rajasthani artisans",
      "Rajasthan crafts shopping"
    ),
    path: "/handicrafts",
    collectionName: "Handicrafts of Rajasthan",
  }),

  folkArts: listPage({
    title: "Rajasthan Folk Arts — Ghoomar, Kathputli & Phad Painting",
    description:
      "Living folk arts of Rajasthan — Ghoomar dance, Kathputli puppetry, Phad painting, Bhavai, Kalbeliya. 1,000+ years of performance traditions.",
    keywords: buildKeywords(
      "Rajasthan folk arts",
      "Ghoomar dance",
      "Kathputli puppet",
      "Phad painting",
      "Bhavai dance",
      "Kalbeliya dance",
      "Rajasthani performing arts"
    ),
    path: "/folk-arts",
    collectionName: "Folk Arts of Rajasthan",
  }),

  folkMusic: listPage({
    title: "Rajasthan Folk Music — Manganiyar, Langa & Desert Songs",
    description:
      "Rajasthan folk music — Manganiyar & Langa musicians, Khamaycha, Sarangi, Morchang. UNESCO heritage desert songs performed for royalty 800+ years.",
    keywords: buildKeywords(
      "Rajasthan folk music",
      "Manganiyar musicians",
      "Langa music",
      "Khamaycha instrument",
      "Rajasthani desert music",
      "Kalbeliya songs"
    ),
    path: "/folk-music",
    collectionName: "Folk Music of Rajasthan",
  }),

  attire: listPage({
    title: "Rajasthan Traditional Dress — Pagri, Ghagra Choli & Jewellery",
    description:
      "Rajasthani attire — Pagri turbans, Ghagra Choli, Bandhani, Leheriya, Kundan & Meenakari jewellery. Royal Rajput clothing & cultural significance.",
    keywords: buildKeywords(
      "Rajasthan traditional dress",
      "Rajasthani Pagri",
      "Ghagra Choli",
      "Bandhani saree",
      "Kundan jewellery Rajasthan",
      "Rajput wedding attire"
    ),
    path: "/attire",
    collectionName: "Traditional Attire of Rajasthan",
  }),

  languages: listPage({
    title: "Rajasthan Languages — Marwari, Mewari, Dhundhari & Dialects",
    description:
      "17 languages & dialects of Rajasthan — Marwari, Mewari, Dhundhari, Harauti, Wagdi. Phrases, scripts, regions & linguistic heritage of the desert state.",
    keywords: buildKeywords(
      "Rajasthan languages",
      "Marwari language",
      "Mewari dialect",
      "Rajasthani language",
      "Dhundhari",
      "learn Marwari phrases"
    ),
    path: "/languages",
    collectionName: "Languages of Rajasthan",
  }),

  communities: listPage({
    title: "Rajasthan Communities — Rajputs, Bhils, Meenas & Tribes",
    description:
      "25+ communities of Rajasthan — Rajputs, Bhils, Meenas, Rabaris, Jats, Banjaras. Tribes, traditions, festivals & cultural contributions.",
    keywords: buildKeywords(
      "Rajasthan communities",
      "Rajput community",
      "Bhils tribe Rajasthan",
      "Meena tribe",
      "Rabari community",
      "Rajasthan tribes",
      "Rajasthan castes"
    ),
    path: "/communities",
    collectionName: "Communities of Rajasthan",
  }),

  experiences: listPage({
    title: "Rajasthan Experiences — Camel Safari, Hot Air Balloon & Palaces",
    description:
      "Unique Rajasthan experiences — Sam Dunes camel safari, Pushkar hot air balloon, Udaipur cooking class, royal palace stays & desert camping.",
    keywords: buildKeywords(
      "Rajasthan experiences",
      "camel safari Jaisalmer",
      "desert safari Rajasthan",
      "hot air balloon Pushkar",
      "palace stay Rajasthan",
      "things to do Rajasthan"
    ),
    path: "/experiences",
    collectionName: "Experiences in Rajasthan",
  }),

  royalWeddings: listPage({
    title: "Royal Wedding Venues Rajasthan — Palace & Lake Weddings",
    description:
      "Luxury wedding venues in Rajasthan — Taj Lake Palace Udaipur, Umaid Bhawan Jodhpur, Rambagh Palace Jaipur. Destination palace weddings in India.",
    keywords: buildKeywords(
      "royal wedding Rajasthan",
      "palace wedding India",
      "Taj Lake Palace wedding",
      "Umaid Bhawan wedding",
      "destination wedding Rajasthan",
      "heritage wedding venue"
    ),
    path: "/royal-weddings",
    collectionName: "Royal Wedding Venues in Rajasthan",
  }),

  unescoSites: listPage({
    title: "UNESCO Sites Rajasthan — Hill Forts, Jantar Mantar & Keoladeo",
    description:
      "UNESCO World Heritage in Rajasthan — Hill Forts (Chittorgarh, Kumbhalgarh, Amer, Ranthambore), Jantar Mantar Jaipur, Keoladeo National Park Bharatpur.",
    keywords: buildKeywords(
      "UNESCO Rajasthan",
      "Hill Forts Rajasthan UNESCO",
      "Jantar Mantar Jaipur",
      "Chittorgarh Fort UNESCO",
      "Kumbhalgarh Fort",
      "Keoladeo National Park"
    ),
    path: "/unesco-sites",
    collectionName: "UNESCO Sites in Rajasthan",
  }),

  dynasties: listPage({
    title: "Rajasthan Royal Dynasties — Mewar, Marwar, Dhundhar & Clans",
    description:
      "Rajput dynasties of Rajasthan — Sisodia Mewar, Rathore Marwar, Kachwaha Dhundhar, Bhati Jaisalmer. Kings, battles, forts & 1,500 years of history.",
    keywords: buildKeywords(
      "Rajasthan dynasties",
      "Mewar dynasty",
      "Marwar dynasty",
      "Sisodia Rajputs",
      "Rathore clan",
      "Kachwaha dynasty",
      "Rajput kingdoms"
    ),
    path: "/dynasties",
    collectionName: "Royal Dynasties of Rajasthan",
  }),

  events: listPage({
    title: "Rajasthan Historical Events — Haldighati, Chittorgarh & Battles",
    description:
      "Key events in Rajasthan history — Battle of Haldighati, Khanwa, sack of Chittorgarh, founding of Jaipur. Rajput valour & defining milestones.",
    keywords: buildKeywords(
      "Rajasthan historical events",
      "Battle of Haldighati",
      "Maharana Pratap Haldighati",
      "Chittorgarh history",
      "Battle of Khanwa",
      "Rajput battles history"
    ),
    path: "/events",
    collectionName: "Historical Events of Rajasthan",
  }),

  directory: listPage({
    title: "Rajasthan Local Guides & Services Directory",
    description:
      "Find verified tour guides, heritage hotels, restaurants & artisans across Rajasthan. Book local experts in Jaipur, Udaipur, Jodhpur & Jaisalmer.",
    keywords: buildKeywords(
      "Rajasthan tour guide",
      "Jaipur local guide",
      "Rajasthan hotels directory",
      "heritage stay Rajasthan",
      "Rajasthan travel services",
      "local guide Jaisalmer"
    ),
    path: "/directory",
    collectionName: "Rajasthan Services Directory",
  }),

  planner: {
    title: `Rajasthan Trip Planner ${YEAR} — AI Itinerary Generator`,
    description:
      "Free AI trip planner for Rajasthan — custom day-by-day itineraries for Jaipur, Udaipur, Jodhpur & Jaisalmer. Set budget, days & interests instantly.",
    keywords: buildKeywords(
      "Rajasthan trip planner",
      "Rajasthan itinerary",
      "Jaipur Udaipur trip plan",
      "AI travel planner India",
      "Rajasthan tour package planner",
      "7 day Rajasthan itinerary"
    ),
    url: buildUrl("/planner"),
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Trip Planner", url: buildUrl("/planner") },
      ]),
      {
        "@type": "WebApplication",
        name: "Rajasthan AI Trip Planner",
        url: buildUrl("/planner"),
        applicationCategory: "TravelApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      }
    ),
  },

  aiAssistant: {
    title: "Ask AI — Rajasthan Travel Guide Chat Assistant",
    description:
      "Chat with AI about Rajasthan — Marwari phrases, festival dates, fort timings, food recipes, hotel tips & emergency helplines. Free 24/7 travel help.",
    keywords: buildKeywords(
      "Rajasthan AI assistant",
      "Rajasthan travel chatbot",
      "Ask AI Rajasthan",
      "Rajasthan travel questions",
      "Marwari translation",
      "Rajasthan travel help"
    ),
    url: buildUrl("/ai-assistant"),
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "AI Assistant", url: buildUrl("/ai-assistant") },
      ]),
      {
        "@type": "SoftwareApplication",
        name: "Rajasthan Connect AI Assistant",
        url: buildUrl("/ai-assistant"),
        applicationCategory: "TravelApplication",
      }
    ),
  },

  directoryRegister: {
    title: "Register Business on Rajasthan Connect — Local Listings",
    description:
      "List your tour guide service, heritage hotel, restaurant or shop on Rajasthan Connect. Reach travellers searching Rajasthan cities, guides & stays.",
    keywords: buildKeywords(
      "register Rajasthan business",
      "Rajasthan tour guide listing",
      "list hotel Rajasthan",
      "Rajasthan Connect directory"
    ),
    url: buildUrl("/directory?register=true"),
  },

  notFound: {
    title: "Page Not Found",
    description: "This page could not be found. Explore Rajasthan cities, festivals, food & travel guides on Rajasthan Connect.",
    keywords: buildKeywords("Rajasthan Connect"),
    url: buildUrl("/404"),
    robots: "noindex, follow",
  },
};

/* ─── Dynamic detail page builders ───────────────────────────────────────── */

export function buildCitySEO(city, id) {
  if (!city) {
    return {
      title: "Rajasthan City Travel Guide",
      description: "Explore cities in Rajasthan — forts, food, festivals, local guides & travel tips.",
      keywords: buildKeywords("Rajasthan cities", "Rajasthan tourism"),
      url: buildUrl(`/cities/${id}`),
    };
  }
  const name = city.name;
  const url = buildUrl(`/cities/${id}`);
  const tagline = city.tagline ? `${city.tagline}. ` : "";
  const desc = truncateDesc(
    `${name} Rajasthan travel guide ${YEAR} — ${tagline}${city.description || ""} Places to visit, food, festivals & local guides.`
  );
  return {
    title: `${name} Rajasthan Travel Guide ${YEAR}`,
    description: desc,
    keywords: buildKeywords(
      `${name} Rajasthan`,
      `${name} tourism`,
      `${name} travel guide`,
      `visit ${name}`,
      `things to do in ${name}`,
      `${name} places to visit`,
      `${name} forts`,
      `${name} food`,
      `${name} festivals`,
      `best time to visit ${name}`
    ),
    image: city.imageUrl || city.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Cities", url: buildUrl("/cities") },
        { name, url },
      ]),
      touristDestinationSchema({ name: `${name}, Rajasthan`, description: city.description, url, image: city.imageUrl })
    ),
  };
}

export function buildPlaceSEO(place, id) {
  if (!place) {
    return {
      title: "Rajasthan Heritage Place Guide",
      description: "Forts, palaces & monuments in Rajasthan — timings, history & travel tips.",
      keywords: buildKeywords("Rajasthan places", "Rajasthan forts"),
      url: buildUrl(`/places/${id}`),
    };
  }
  const title = place.title;
  const city = place.city || place.city_name || "";
  const url = buildUrl(`/places/${id}`);
  const category = place.category || "heritage site";
  const desc = truncateDesc(
    `Visit ${title}${city ? ` in ${city}, Rajasthan` : ", Rajasthan"} — ${place.description || category}. Timings, entry fee, history & travel tips.`
  );
  return {
    title: `${title}${city ? ` ${city}` : ""} Rajasthan — Guide & Timings`,
    description: desc,
    keywords: buildKeywords(
      title,
      `${title} Rajasthan`,
      `visit ${title}`,
      `${title} timings`,
      `${title} entry fee`,
      `${title} history`,
      city && `${title} ${city}`,
      category,
      "Rajasthan forts and palaces"
    ),
    image: place.imageUrls?.[0] || place.image_urls?.[0],
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Places", url: buildUrl("/places") },
        { name: title, url },
      ]),
      landmarkSchema({ name: title, description: place.description, url, image: place.imageUrls?.[0], city })
    ),
  };
}

export function buildFoodSEO(food, id) {
  if (!food) {
    return {
      title: "Rajasthani Food & Recipe Guide",
      description: "Authentic Rajasthani recipes, history & where to eat traditional dishes.",
      keywords: buildKeywords("Rajasthani food", "Rajasthani recipes"),
      url: buildUrl(`/foods/${id}`),
    };
  }
  const title = food.title;
  const origin = food.origin || food.city || "";
  const url = buildUrl(`/foods/${id}`);
  const desc = truncateDesc(
    `${title} — authentic Rajasthani dish${origin ? ` from ${origin}` : ""}. ${food.description || ""} Recipe, ingredients, history & best places to eat.`
  );
  return {
    title: `${title} Recipe — Rajasthani Food Guide`,
    description: desc,
    keywords: buildKeywords(
      title,
      `${title} recipe`,
      `how to make ${title}`,
      `${title} Rajasthan`,
      "Rajasthani food",
      "Rajasthani cuisine",
      origin && `${title} ${origin}`
    ),
    image: food.imageUrl || food.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Foods", url: buildUrl("/foods") },
        { name: title, url },
      ]),
      recipeSchema({ name: title, description: food.description, url, image: food.imageUrl })
    ),
  };
}

export function buildFestivalSEO(festival, id) {
  if (!festival) {
    return {
      title: "Rajasthan Festival Guide",
      description: "Festival dates, significance, dress codes & travel tips for Rajasthan.",
      keywords: buildKeywords("Rajasthan festivals"),
      url: buildUrl(`/festivals/${id}`),
    };
  }
  const title = festival.title;
  const url = buildUrl(`/festivals/${id}`);
  const location = festival.city || festival.location || "Rajasthan";
  const desc = truncateDesc(
    `${title} in ${location}, Rajasthan — ${festival.importance || festival.description || ""} Dates, travel tips, dress code & how to experience it.`
  );
  return {
    title: `${title} Rajasthan — Dates, Guide & Travel Tips`,
    description: desc,
    keywords: buildKeywords(
      title,
      `${title} Rajasthan`,
      `${title} dates`,
      `${title} ${location}`,
      `travel tips ${title}`,
      `${title} dress code`,
      "Rajasthan festivals"
    ),
    image: festival.imageUrls?.[0] || festival.image_urls?.[0],
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Festivals", url: buildUrl("/festivals") },
        { name: title, url },
      ]),
      eventSchema({ name: `${title}, Rajasthan`, description: festival.importance, url, location })
    ),
  };
}

export function buildCultureSEO(topic, id) {
  if (!topic) {
    return {
      title: "Rajasthani Culture & Folk Arts",
      description: "Traditional music, attire, crafts & folk arts of Rajasthan.",
      keywords: buildKeywords("Rajasthan culture"),
      url: buildUrl(`/culture/${id}`),
    };
  }
  const title = topic.title;
  const category = topic.category || "culture";
  const url = buildUrl(`/culture/${id}`);
  const desc = truncateDesc(
    `${title} — ${category} of Rajasthan. ${topic.description || ""} History, significance & living traditions of the Land of Kings.`
  );
  return {
    title: `${title} — Rajasthani ${category} Guide`,
    description: desc,
    keywords: buildKeywords(title, `${title} Rajasthan`, `Rajasthani ${category}`, "Rajasthan culture", "Rajasthan traditions"),
    image: topic.image_url || topic.imageUrl,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "History & Culture", url: buildUrl("/history-culture") },
        { name: title, url },
      ]),
      articleSchema({ name: title, description: topic.description, url, image: topic.image_url })
    ),
  };
}

export function buildRulerSEO(ruler, id) {
  if (!ruler) {
    return {
      title: "Rajput Ruler Biography — Rajasthan History",
      description: "Biographies of Rajput kings and rulers of Rajasthan.",
      keywords: buildKeywords("Rajasthan rulers", "Rajput kings"),
      url: buildUrl(`/rulers/${id}`),
    };
  }
  const name = ruler.name;
  const dynasty = ruler.dynasty || ruler.kingdom || "";
  const url = buildUrl(`/rulers/${id}`);
  const desc = truncateDesc(
    `${name}${dynasty ? ` of ${dynasty}` : ""} — Rajput ruler of Rajasthan. ${ruler.biography || ""} Battles, legacy & history of the Land of Kings.`
  );
  return {
    title: `${name} — Rajput King of Rajasthan History`,
    description: desc,
    keywords: buildKeywords(name, `${name} biography`, dynasty, "Rajput king", "Rajasthan history", "Rajasthan rulers"),
    image: ruler.image_url || ruler.imageUrl,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "History & Culture", url: buildUrl("/history-culture") },
        { name: name, url },
      ]),
      articleSchema({ name, description: ruler.biography, url })
    ),
  };
}

export function buildHandicraftSEO(craft, id) {
  if (!craft) {
    return {
      title: "Rajasthan Handicraft Guide",
      description: "Traditional artisan crafts of Rajasthan.",
      keywords: buildKeywords("Rajasthan handicrafts"),
      url: buildUrl(`/handicrafts/${id}`),
    };
  }
  const name = craft.name;
  const city = craft.origin_city || craft.origin_city_id || "";
  const url = buildUrl(`/handicrafts/${id}`);
  const desc = truncateDesc(
    `${name} — traditional Rajasthan handicraft${city ? ` from ${city}` : ""}. ${craft.process_description || craft.description || ""} Artisan process, history & where to buy.`
  );
  return {
    title: `${name} — Rajasthan Handicraft & Artisan Guide`,
    description: desc,
    keywords: buildKeywords(name, `${name} Rajasthan`, `${name} handicraft`, "Rajasthan handicrafts", "Rajasthani artisans", city && `${name} ${city}`),
    image: craft.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Handicrafts", url: buildUrl("/handicrafts") },
        { name, url },
      ]),
      articleSchema({ name, description: craft.description, url })
    ),
  };
}

export function buildFolkArtSEO(art, id) {
  if (!art) {
    return {
      title: "Rajasthan Folk Art Guide",
      description: "Ghoomar, Kathputli, Phad & folk performing arts of Rajasthan.",
      keywords: buildKeywords("Rajasthan folk arts"),
      url: buildUrl(`/folk-arts/${id}`),
    };
  }
  const name = art.name;
  const region = art.region || art.origin || "";
  const url = buildUrl(`/folk-arts/${id}`);
  const desc = truncateDesc(
    `${name} — folk art of Rajasthan${region ? ` from ${region}` : ""}. ${art.history_origin || art.description || ""} History, performance & cultural significance.`
  );
  return {
    title: `${name} — Rajasthan Folk Art & Tradition`,
    description: desc,
    keywords: buildKeywords(name, `${name} Rajasthan`, `${name} folk art`, "Rajasthan folk arts", "Rajasthani performing arts", region),
    image: art.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Folk Arts", url: buildUrl("/folk-arts") },
        { name, url },
      ]),
      articleSchema({ name, description: art.description, url })
    ),
  };
}

export function buildFolkMusicSEO(item, id) {
  if (!item) {
    return {
      title: "Rajasthan Folk Music Guide",
      description: "Manganiyar, Langa & desert music traditions of Rajasthan.",
      keywords: buildKeywords("Rajasthan folk music"),
      url: buildUrl(`/folk-music/${id}`),
    };
  }
  const name = item.name;
  const community = item.community || "";
  const url = buildUrl(`/folk-music/${id}`);
  const desc = truncateDesc(
    `${name} — Rajasthan folk music${community ? ` by ${community} community` : ""}. ${item.origin_history || item.description || ""} Instruments, history & performances.`
  );
  return {
    title: `${name} — Rajasthan Folk Music & Heritage`,
    description: desc,
    keywords: buildKeywords(name, `${name} Rajasthan`, "Rajasthan folk music", community, "Manganiyar", "desert music Rajasthan"),
    image: item.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Folk Music", url: buildUrl("/folk-music") },
        { name, url },
      ]),
      articleSchema({ name, description: item.description, url })
    ),
  };
}

export function buildAttireSEO(item, id) {
  if (!item) {
    return {
      title: "Rajasthan Traditional Attire Guide",
      description: "Pagri, Ghagra Choli & royal dress of Rajasthan.",
      keywords: buildKeywords("Rajasthan attire"),
      url: buildUrl(`/attire/${id}`),
    };
  }
  const name = item.name;
  const url = buildUrl(`/attire/${id}`);
  const desc = truncateDesc(
    `${name} — traditional Rajasthani attire. ${item.cultural_significance || item.description || ""} History, styling & cultural meaning in Rajput heritage.`
  );
  return {
    title: `${name} — Traditional Rajasthani Dress Guide`,
    description: desc,
    keywords: buildKeywords(name, `${name} Rajasthan`, "Rajasthan traditional dress", "Rajasthani clothing", "Rajput attire"),
    image: item.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Attire", url: buildUrl("/attire") },
        { name, url },
      ]),
      articleSchema({ name, description: item.description, url })
    ),
  };
}

export function buildCommunitySEO(item, id) {
  if (!item) {
    return {
      title: "Rajasthan Community & Tribe Guide",
      description: "Communities and tribes of Rajasthan — traditions & culture.",
      keywords: buildKeywords("Rajasthan communities"),
      url: buildUrl(`/communities/${id}`),
    };
  }
  const name = item.name;
  const region = item.region || (Array.isArray(item.primary_regions) ? item.primary_regions.join(", ") : item.primary_regions) || "";
  const url = buildUrl(`/communities/${id}`);
  const desc = truncateDesc(
    `${name} community of Rajasthan${region ? ` in ${region}` : ""}. ${item.lifestyle_history || item.description || ""} Traditions, festivals & cultural heritage.`
  );
  return {
    title: `${name} — Community & Tribe of Rajasthan`,
    description: desc,
    keywords: buildKeywords(name, `${name} Rajasthan`, `${name} tribe`, "Rajasthan communities", "Rajasthan tribes", region),
    image: item.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Communities", url: buildUrl("/communities") },
        { name, url },
      ]),
      articleSchema({ name, description: item.description, url })
    ),
  };
}

export function buildExperienceSEO(item, id) {
  if (!item) {
    return {
      title: "Rajasthan Travel Experience Guide",
      description: "Unique experiences in Rajasthan — safaris, balloons & palace stays.",
      keywords: buildKeywords("Rajasthan experiences"),
      url: buildUrl(`/experiences/${id}`),
    };
  }
  const title = item.title;
  const city = item.city || item.location || "";
  const url = buildUrl(`/experiences/${id}`);
  const desc = truncateDesc(
    `${title}${city ? ` in ${city}, Rajasthan` : " in Rajasthan"} — ${item.description || ""} Book, pricing tips & what to expect.`
  );
  return {
    title: `${title}${city ? ` ${city}` : ""} — Rajasthan Experience`,
    description: desc,
    keywords: buildKeywords(title, `${title} Rajasthan`, city && `${title} ${city}`, "Rajasthan experiences", "things to do Rajasthan"),
    image: item.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Experiences", url: buildUrl("/experiences") },
        { name: title, url },
      ]),
      touristDestinationSchema({ name: title, description: item.description, url })
    ),
  };
}

export function buildRoyalWeddingSEO(item, id) {
  if (!item) {
    return {
      title: "Royal Wedding Venue Rajasthan",
      description: "Palace and heritage wedding venues in Rajasthan.",
      keywords: buildKeywords("royal wedding Rajasthan"),
      url: buildUrl(`/royal-weddings/${id}`),
    };
  }
  const name = item.name;
  const city = item.city || item.location || "";
  const url = buildUrl(`/royal-weddings/${id}`);
  const desc = truncateDesc(
    `${name}${city ? `, ${city}` : ""} — royal wedding venue in Rajasthan. ${item.description || ""} Palace weddings, capacity & destination wedding guide.`
  );
  return {
    title: `${name}${city ? ` ${city}` : ""} — Royal Wedding Venue Rajasthan`,
    description: desc,
    keywords: buildKeywords(name, `${name} wedding`, "royal wedding Rajasthan", "palace wedding India", city && `wedding venue ${city}`),
    image: item.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Royal Weddings", url: buildUrl("/royal-weddings") },
        { name, url },
      ]),
      articleSchema({ name, description: item.description, url })
    ),
  };
}

export function buildUnescoSEO(item, id) {
  if (!item) {
    return {
      title: "UNESCO Heritage Site Rajasthan",
      description: "UNESCO World Heritage sites in Rajasthan.",
      keywords: buildKeywords("UNESCO Rajasthan"),
      url: buildUrl(`/unesco-sites/${id}`),
    };
  }
  const name = item.name;
  const city = item.city || item.location || "";
  const url = buildUrl(`/unesco-sites/${id}`);
  const desc = truncateDesc(
    `${name} — UNESCO World Heritage Site${city ? ` in ${city}, Rajasthan` : " in Rajasthan"}. ${item.description || ""} History, timings & visitor guide.`
  );
  return {
    title: `${name} — UNESCO Heritage Site Rajasthan`,
    description: desc,
    keywords: buildKeywords(name, `${name} UNESCO`, `${name} Rajasthan`, "UNESCO Rajasthan", "World Heritage India", city),
    image: item.image_url,
    url,
    schema: graph(
      breadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "UNESCO Sites", url: buildUrl("/unesco-sites") },
        { name, url },
      ]),
      landmarkSchema({ name, description: item.description, url, city })
    ),
  };
}
