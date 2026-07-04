import { callGroq, isGroqConfigured } from "./client.js";

const PLANNER_SYSTEM_PROMPT = `You are the official AI Trip Planner for RajasthanConnect (rajasthanconnect.in).
You create day-by-day sightseeing itineraries ONLY for Rajasthan, India.

STRICT RULES:
- Every activity must be in Rajasthan (Jaipur, Jodhpur, Udaipur, Jaisalmer, Pushkar, Bikaner, etc.).
- Use real forts, palaces, markets, restaurants, and heritage sites.
- Respond ONLY with valid JSON — no markdown, no code fences, no images, no commentary outside JSON.
- All text fields must be plain readable text for travelers (no HTML, no URLs to images).
- Costs in INR. Realistic timings and travel durations.
- If input is invalid, still return valid JSON with sensible Rajasthan defaults.`;

const MOCK_ACTIVITIES = {
  jaipur: [
    { time: "08:30 AM", activity: "Traditional Breakfast", location: "Laxmi Misthan Bhandar (LMB)", cost: 200, travelTime: "15 mins", details: "Enjoy hot Pyaz Kachori, spicy Mirchi Vadas, and sweet Mawa Kachoris to start your day with authentic Jaipur flavors." },
    { time: "10:00 AM", activity: "Explore Hawa Mahal", location: "Hawa Mahal, Old City", cost: 50, travelTime: "10 mins", details: "Explore the landmark Palace of Winds. Admire the 953 jharokhas designed for royal ladies to view street processions." },
    { time: "11:30 AM", activity: "Visit City Palace & Jantar Mantar", location: "City Palace Complex", cost: 300, travelTime: "5 mins walk", details: "Marvel at the blend of Rajput and Mughal architecture, and visit the adjacent world-heritage astronomical observatory." },
    { time: "01:30 PM", activity: "Authentic Rajasthani Thali", location: "Surya Mahal Restaurant", cost: 450, travelTime: "10 mins", details: "Savor a grand Rajasthani thali featuring Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, and garlic chutney." },
    { time: "03:00 PM", activity: "Tour the Majestic Amber Fort", location: "Amer, Jaipur", cost: 100, travelTime: "25 mins drive", details: "Ride a jeep up the ramparts of Amer Fort. Visit the stunning Sheesh Mahal (Mirror Palace) and hear royal stories." },
    { time: "06:00 PM", activity: "Sunset view of Jal Mahal", location: "Man Sagar Lake", cost: 0, travelTime: "15 mins", details: "Capture photographs of the water palace glowing in gold as the sun sets behind the Aravalli hills." },
    { time: "07:30 PM", activity: "Shopping at Johari & Bapu Bazaar", location: "Johari Bazar", cost: 500, travelTime: "15 mins", details: "Shop for traditional block-print textiles, blue pottery, mojari leather shoes, and silver jewelry." },
    { time: "09:00 PM", activity: "Royal Dinner and Folk Dance", location: "Chokhi Dhani Heritage Village", cost: 1100, travelTime: "40 mins", details: "Experience village-style hospitality, watch puppet shows, ride camels, and enjoy a traditional feast served on leaf platters." },
  ],
  jodhpur: [
    { time: "08:30 AM", activity: "Morning Jodhpuri Breakfast", location: "Janta Sweet Home", cost: 150, travelTime: "10 mins", details: "Try their famous Mawa Kachori, Mirchi Vada, and hot saffron milk." },
    { time: "09:30 AM", activity: "Ascend Mehrangarh Fort", location: "Mehrangarh Fort Skyline", cost: 100, travelTime: "15 mins", details: "Explore one of India's largest and most intact forts. Visit the museum containing royal palanquins, armor, and weapons." },
    { time: "12:30 PM", activity: "Stroll through Jaswant Thada", location: "Jaswant Thada Cenotaph", cost: 50, travelTime: "5 mins", details: "A peaceful white marble cenotaph built in memory of Maharaja Jaswant Singh II, sitting by a tranquil lake." },
    { time: "01:30 PM", activity: "Local Lunch with a View", location: "Stepwell Cafe", cost: 400, travelTime: "10 mins", details: "Have lunch overlooking the historic Toorji Ka Jhalra stepwell, watching locals dive into the deep blue waters." },
    { time: "03:00 PM", activity: "Blue City Guided Walking Tour", location: "Brahmapuri Old Streets", cost: 500, travelTime: "5 mins", details: "Walk through the historic maze of indigo-blue painted houses, talking to locals and discovering hidden temples." },
    { time: "06:00 PM", activity: "Sunset at Rao Jodha Desert Rock Park", location: "Rao Jodha Park", cost: 100, travelTime: "10 mins", details: "Walk through restored volcanic rocky terrain showcasing native desert flora, with Mehrangarh Fort towering in the background." },
    { time: "08:00 PM", activity: "Spice Shopping and Clock Tower", location: "Sardar Market", cost: 300, travelTime: "15 mins", details: "Shop for Mathania red chilies, hand-ground spices, and traditional Jodhpuri handloom prints." },
  ],
  udaipur: [
    { time: "08:30 AM", activity: "Breakfast by Lake Pichola", location: "Jethis Restaurant", cost: 200, travelTime: "10 mins", details: "Enjoy hot tea and poha with a stunning morning breeze overlooking the lake." },
    { time: "09:30 AM", activity: "Udaipur City Palace Tour", location: "City Palace Complex", cost: 250, travelTime: "10 mins", details: "Walk through the sprawling palace museum, marveling at the peacock square, glass mosaics, and royal weapons." },
    { time: "12:30 PM", activity: "Visit Jagdish Temple", location: "Jagdish Chowk", cost: 0, travelTime: "2 mins walk", details: "Admire the 3-story Indo-Aryan style stone carvings of Lord Vishnu, built in 1651." },
    { time: "01:30 PM", activity: "Mewari Feast", location: "Krishna Dal Bati", cost: 350, travelTime: "10 mins", details: "Indulge in unlimited, rich Dal Baati Churma served with garlic chutney and buttermilk." },
    { time: "03:00 PM", activity: "Boat Ride on Lake Pichola", location: "Rameshwar Ghat", cost: 400, travelTime: "5 mins", details: "Enjoy a scenic boat cruise around Lake Palace (Taj Lake Palace) and stop at Jag Mandir Island Palace." },
    { time: "05:00 PM", activity: "Explore Saheliyon-ki-Bari", location: "Saheliyon-ki-Bari Gardens", cost: 50, travelTime: "15 mins", details: "Walk through the 'Garden of the Maidens' featuring marble fountains, lotus pools, and luxury green lawns." },
    { time: "07:00 PM", activity: "Dharohar Folk Dance Show", location: "Bagore Ki Haveli", cost: 150, travelTime: "15 mins", details: "Watch a high-energy 1-hour Rajasthani folk dance, puppet show, and musical performance inside an 18th-century haveli." },
  ],
  jaisalmer: [
    { time: "08:30 AM", activity: "Desert Morning Tea & Poha", location: "Trio Restaurant", cost: 150, travelTime: "10 mins", details: "Have breakfast on a rooftop overlooking Jaisalmer Fort." },
    { time: "09:30 AM", activity: "Walk inside Jaisalmer Fort", location: "Sonar Qila", cost: 50, travelTime: "10 mins", details: "Explore the massive golden sandstone fort. Visit the beautiful Jain temples and the king's palace museum." },
    { time: "12:30 PM", activity: "Tour Patwon Ki Haveli", location: "Patwon Ki Haveli St.", cost: 100, travelTime: "10 mins", details: "Admire the yellow sandstone mesh carvings on this cluster of 5 grand townhouses built by wealthy merchants." },
    { time: "01:30 PM", activity: "Lunch", location: "Desert Boy's Dhaba", cost: 300, travelTime: "5 mins", details: "Savor Ker Sangri and Bajra roti cooked in traditional earthen pots." },
    { time: "03:30 PM", activity: "Depart for Sam Sand Dunes", location: "Thar Desert", cost: 1500, travelTime: "45 mins drive", details: "Take a jeep ride to the deep sand dunes for an adventure of a lifetime." },
    { time: "05:30 PM", activity: "Camel Safari & Sunset", location: "Sam Sand Dunes", cost: 400, travelTime: "Direct", details: "Ride a camel over the soft ridges of sand dunes, watching the sun dip below the desert horizon." },
    { time: "07:30 PM", activity: "Starlit Camp Dinner & Folk Show", location: "Royal Desert Camp", cost: 1200, travelTime: "Direct", details: "Gather around a campfire to hear Langas and Manganiyars play traditional folk music, followed by a buffet dinner." },
  ],
};

function buildMockItinerary({ days, budget, startingCity, interests }) {
  const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 7);
  const budgetNum = parseInt(budget) || 15000;
  const startCity = (startingCity || "Jaipur").toLowerCase();
  const activeInterests = interests || ["History", "Food", "Culture"];
  const activitiesPool = MOCK_ACTIVITIES[startCity] || MOCK_ACTIVITIES.jaipur;
  const itineraryDays = [];

  for (let d = 1; d <= numDays; d++) {
    let dayActivities = [];
    if (d === 1) {
      dayActivities = activitiesPool.slice(0, Math.min(activitiesPool.length, 3));
    } else if (d === 2) {
      dayActivities = activitiesPool.slice(Math.min(activitiesPool.length, 3), Math.min(activitiesPool.length, 6));
    } else {
      dayActivities = [
        activitiesPool[0],
        {
          time: "10:30 AM",
          activity: "Explore Nearby Village & Artisans",
          location: startCity === "jaipur" ? "Sanganer Block Print village" : "Osian Desert Oasis",
          cost: 200,
          travelTime: "45 mins drive",
          details: "A cultural day-trip excursion. Visit family-run workshops of local master craftsmen to see printing, pottery, or weaving first-hand.",
        },
        activitiesPool[activitiesPool.length - 1],
      ];
    }

    if (activeInterests.includes("Shopping") && d === 2) {
      dayActivities.push({
        time: "04:30 PM",
        activity: "Handicrafts Emporium & Souvenir Shopping",
        location: "Government Rajasthali Emporium",
        cost: 1000,
        travelTime: "15 mins",
        details: "Buy high-quality, government-certified blue pottery, carpets, and miniature paintings while supporting local co-ops.",
      });
    }

    itineraryDays.push({
      dayNumber: d,
      theme: d === 1 ? `Historic Landmarks of ${startingCity}` : d === 2 ? "Artisans, Shopping & Local Food" : "Hidden Gems & Desert Horizons",
      schedule: dayActivities.map((act) => ({
        ...act,
        cost: budgetNum < 10000 ? Math.floor(act.cost * 0.7) : act.cost,
      })),
    });
  }

  const calculatedCost = itineraryDays.reduce(
    (sum, day) => sum + day.schedule.reduce((dSum, act) => dSum + act.cost, 0),
    0,
  );

  return {
    title: `Grand Heritage Exploration: Starting in ${startingCity}`,
    days: itineraryDays,
    totalEstimatedCost: calculatedCost,
    travelTips: [
      "Drink bottled mineral water exclusively and keep hydrated in the dry desert climate.",
      "Always hire government-licensed tour guides carrying ID badges at major forts.",
      "Negotiate taxi and auto-rickshaw fares BEFORE starting the ride, or use app-based cabs.",
      "Dress respectfully (shoulders and knees covered) when visiting temples and active shrines.",
    ],
  };
}

function parseItineraryJson(content) {
  const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed.days?.length) return null;
  return parsed;
}

/**
 * Generate a Rajasthan-only day-by-day trip itinerary.
 */
export async function generateItinerary({ days, budget, startingCity, interests }) {
  const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 7);
  const budgetNum = parseInt(budget) || 15000;
  const activeInterests = interests || ["History", "Food", "Culture"];

  if (isGroqConfigured()) {
    try {
      const userPrompt = `Create a ${numDays}-day Rajasthan sightseeing itinerary.
Starting city: ${startingCity}
Budget: ${budgetNum} INR total
Interests: ${activeInterests.join(", ")}

Return JSON with this exact structure:
{
  "title": "short poetic trip title",
  "days": [
    {
      "dayNumber": 1,
      "theme": "day focus",
      "schedule": [
        {
          "time": "08:30 AM",
          "activity": "Activity Name",
          "location": "Specific Spot Name",
          "cost": 200,
          "travelTime": "15 mins",
          "details": "2-3 sentence local guide description"
        }
      ]
    }
  ],
  "totalEstimatedCost": 5000,
  "travelTips": ["tip 1", "tip 2", "tip 3"]
}`;

      const content = await callGroq(
        [
          { role: "system", content: PLANNER_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        { jsonMode: true, temperature: 0.3 },
      );

      if (content) {
        const parsed = parseItineraryJson(content);
        if (parsed) return parsed;
      }
    } catch (err) {
      console.error("Groq planner failed:", err.message);
    }
  }

  return buildMockItinerary({ days, budget, startingCity, interests });
}
