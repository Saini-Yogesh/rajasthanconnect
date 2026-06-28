import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const isGeminiConfigured = apiKey.trim() !== '';

const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;

if (isGeminiConfigured) {
  console.log('🤖 Connected to Google Gemini API (model: gemini-2.0-flash)');
} else {
  console.log('⚠️ GEMINI_API_KEY not found. AI features will run in Local Mock Mode.');
}

const MOCK_ACTIVITIES = {
  jaipur: [
    { time: "08:30 AM", activity: "Traditional Breakfast", location: "Laxmi Misthan Bhandar (LMB)", cost: 200, travelTime: "15 mins", details: "Enjoy hot Pyaz Kachori, spicy Mirchi Vadas, and sweet Mawa Kachoris to start your day with authentic Jaipur flavors." },
    { time: "10:00 AM", activity: "Explore Hawa Mahal", location: "Hawa Mahal, Old City", cost: 50, travelTime: "10 mins", details: "Explore the landmark Palace of Winds. Admire the 953 jharokhas designed for royal ladies to view street processions." },
    { time: "11:30 AM", activity: "Visit City Palace & Jantar Mantar", location: "City Palace Complex", cost: 300, travelTime: "5 mins walk", details: "Marvel at the blend of Rajput and Mughal architecture, and visit the adjacent world-heritage astronomical observatory." },
    { time: "01:30 PM", activity: "Authentic Rajasthani Thali", location: "Surya Mahal Restaurant", cost: 450, travelTime: "10 mins", details: "Savor a grand Rajasthani thali featuring Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, and garlic chutney." },
    { time: "03:00 PM", activity: "Tour the Majestic Amber Fort", location: "Amer, Jaipur", cost: 100, travelTime: "25 mins drive", details: "Ride a jeep up the ramparts of Amer Fort. Visit the stunning Sheesh Mahal (Mirror Palace) and hear royal stories." },
    { time: "06:00 PM", activity: "Sunset view of Jal Mahal", location: "Man Sagar Lake", cost: 0, travelTime: "15 mins", details: "Capture photographs of the water palace glowing in gold as the sun sets behind the Aravalli hills." },
    { time: "07:30 PM", activity: "Shopping at Johari & Bapu Bazaar", location: "Johari Bazar", cost: 500, travelTime: "15 mins", details: "Shop for traditional block-print textiles, blue pottery, mojari leather shoes, and silver jewelry." },
    { time: "09:00 PM", activity: "Royal Dinner and Folk Dance", location: "Chokhi Dhani Heritage Village", cost: 1100, travelTime: "40 mins", details: "Experience village-style hospitality, watch puppet shows, ride camels, and enjoy a traditional feast served on leaf platters." }
  ],
  jodhpur: [
    { time: "08:30 AM", activity: "Morning Jodhpuri Breakfast", location: "Janta Sweet Home", cost: 150, travelTime: "10 mins", details: "Try their famous Mawa Kachori, Mirchi Vada, and hot saffron milk." },
    { time: "09:30 AM", activity: "Ascend Mehrangarh Fort", location: "Mehrangarh Fort Skyline", cost: 100, travelTime: "15 mins", details: "Explore one of India's largest and most intact forts. Visit the museum containing royal palanquins, armor, and weapons." },
    { time: "12:30 PM", activity: "Stroll through Jaswant Thada", location: "Jaswant Thada Cenotaph", cost: 50, travelTime: "5 mins", details: "A peaceful white marble cenotaph built in memory of Maharaja Jaswant Singh II, sitting by a tranquil lake." },
    { time: "01:30 PM", activity: "Local Lunch with a View", location: "Stepwell Cafe", cost: 400, travelTime: "10 mins", details: "Have lunch overlooking the historic Toorji Ka Jhalra stepwell, watching locals dive into the deep blue waters." },
    { time: "03:00 PM", activity: "Blue City Guided Walking Tour", location: "Brahmapuri Old Streets", cost: 500, travelTime: "5 mins", details: "Walk through the historic maze of indigo-blue painted houses, talking to locals and discovering hidden temples." },
    { time: "06:00 PM", activity: "Sunset at Rao Jodha Desert Rock Park", location: "Rao Jodha Park", cost: 100, travelTime: "10 mins", details: "Walk through restored volcanic rocky terrain showcasing native desert flora, with Mehrangarh Fort towering in the background." },
    { time: "08:00 PM", activity: "Spice Shopping and Clock Tower", location: "Sardar Market", cost: 300, travelTime: "15 mins", details: "Shop for Mathania red chilies, hand-ground spices, and traditional Jodhpuri handloom prints." }
  ],
  udaipur: [
    { time: "08:30 AM", activity: "Breakfast by Lake Pichola", location: "Jethis Restaurant", cost: 200, travelTime: "10 mins", details: "Enjoy hot tea and poha with a stunning morning breeze overlooking the lake." },
    { time: "09:30 AM", activity: "Udaipur City Palace Tour", location: "City Palace Complex", cost: 250, travelTime: "10 mins", details: "Walk through the sprawling palace museum, marveling at the peacock square, glass mosaics, and royal weapons." },
    { time: "12:30 PM", activity: "Visit Jagdish Temple", location: "Jagdish Chowk", cost: 0, travelTime: "2 mins walk", details: "Admire the 3-story Indo-Aryan style stone carvings of Lord Vishnu, built in 1651." },
    { time: "01:30 PM", activity: "Mewari Feast", location: "Krishna Dal Bati", cost: 350, travelTime: "10 mins", details: "Indulge in unlimited, rich Dal Baati Churma served with garlic chutney and buttermilk." },
    { time: "03:00 PM", activity: "Boat Ride on Lake Pichola", location: "Rameshwar Ghat", cost: 400, travelTime: "5 mins", details: "Enjoy a scenic boat cruise around Lake Palace (Taj Lake Palace) and stop at Jag Mandir Island Palace." },
    { time: "05:00 PM", activity: "Explore Saheliyon-ki-Bari", location: "Saheliyon-ki-Bari Gardens", cost: 50, travelTime: "15 mins", details: "Walk through the 'Garden of the Maidens' featuring marble fountains, lotus pools, and luxury green lawns." },
    { time: "07:00 PM", activity: "Dharohar Folk Dance Show", location: "Bagore Ki Haveli", cost: 150, travelTime: "15 mins", details: "Watch a high-energy 1-hour Rajasthani folk dance, puppet show, and musical performance inside an 18th-century haveli." }
  ],
  jaisalmer: [
    { time: "08:30 AM", activity: "Desert Morning Tea & Poha", location: "Trio Restaurant", cost: 150, travelTime: "10 mins", details: "Have breakfast on a rooftop overlooking Jaisalmer Fort." },
    { time: "09:30 AM", activity: "Walk inside Jaisalmer Fort", location: "Sonar Qila", cost: 50, travelTime: "10 mins", details: "Explore the massive golden sandstone fort. Visit the beautiful Jain temples and the king's palace museum." },
    { time: "12:30 PM", activity: "Tour Patwon Ki Haveli", location: "Patwon Ki Haveli St.", cost: 100, travelTime: "10 mins", details: "Admire the yellow sandstone mesh carvings on this cluster of 5 grand townhouses built by wealthy merchants." },
    { time: "01:30 PM", activity: "Lunch", location: "Desert Boy's Dhaba", cost: 300, travelTime: "5 mins", details: "Savor Ker Sangri and Bajra roti cooked in traditional earthen pots." },
    { time: "03:30 PM", activity: "Depart for Sam Sand Dunes", location: "Thar Desert", cost: 1500, travelTime: "45 mins drive", details: "Take a jeep ride to the deep sand dunes for an adventure of a lifetime." },
    { time: "05:30 PM", activity: "Camel Safari & Sunset", location: "Sam Sand Dunes", cost: 400, travelTime: "Direct", details: "Ride a camel over the soft ridges of sand dunes, watching the sun dip below the desert horizon." },
    { time: "07:30 PM", activity: "Starlit Camp Dinner & Folk Show", location: "Royal Desert Camp", cost: 1200, travelTime: "Direct", details: "Gather around a campfire to hear Langas and Manganiyars play traditional folk music, followed by a buffet dinner." }
  ]
};

export const gemini = {
  async generateItinerary({ days, budget, startingCity, interests }) {
    const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 7);
    const budgetNum = parseInt(budget) || 15000;
    const startCity = (startingCity || 'Jaipur').toLowerCase();
    const activeInterests = interests || ['History', 'Food', 'Culture'];

    if (ai) {
      try {
        const prompt = `You are a local expert travel planner for Rajasthan. Create a detailed ${numDays}-day travel itinerary starting in the city of "${startingCity}". 
The traveler has a budget of ${budgetNum} INR and is interested in: ${activeInterests.join(', ')}.

Respond ONLY with a valid, clean JSON object (do not wrap in markdown \`\`\`json block or provide any other text outside the JSON). The JSON must match the following structure:
{
  "title": "A short, descriptive, poetic title for the trip",
  "days": [
    {
      "dayNumber": 1,
      "theme": "The focus of this day",
      "schedule": [
        {
          "time": "Time (e.g., 08:30 AM)",
          "activity": "Activity Name",
          "location": "Specific Spot Name",
          "cost": Estimated cost in INR (number),
          "travelTime": "Travel time from previous spot (e.g., 15 mins)",
          "details": "A detailed local guide description explaining what to see, what to eat, or local history (2-3 sentences)."
        }
      ]
    }
  ],
  "totalEstimatedCost": Estimated total cost of listed activities (number),
  "travelTips": ["Array of 3-4 highly useful local tips for safety, dressing, negotiating, or timings"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
        });

        const rawText = response.text || '';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedItinerary = JSON.parse(cleanedText);
        return parsedItinerary;

      } catch (err) {
        console.error('Gemini API call failed, falling back to mock itinerary:', err);
      }
    }

    const activitiesPool = MOCK_ACTIVITIES[startCity] || MOCK_ACTIVITIES['jaipur'];
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
            activity: `Explore Nearby Village & Artisans`, 
            location: startCity === 'jaipur' ? 'Sanganer Block Print village' : 'Osian Desert Oasis', 
            cost: 200, 
            travelTime: "45 mins drive", 
            details: `A cultural day-trip excursion. Visit family-run workshops of local master craftsmen to see printing, pottery, or weaving first-hand.` 
          },
          activitiesPool[activitiesPool.length - 1]
        ];
      }

      if (activeInterests.includes('Shopping') && d === 2) {
        dayActivities.push({
          time: "04:30 PM",
          activity: "Handicrafts Emporium & Souvenir Shopping",
          location: "Government Rajasthali Emporium",
          cost: 1000,
          travelTime: "15 mins",
          details: "Buy high-quality, government-certified blue pottery, carpets, and miniature paintings while supporting local co-ops."
        });
      }

      itineraryDays.push({
        dayNumber: d,
        theme: d === 1 ? `Historic Landmarks of ${startingCity}` : d === 2 ? `Artisans, Shopping & Local Food` : `Hidden Gems & Desert Horizons`,
        schedule: dayActivities.map((act, index) => ({
          ...act,
          cost: budgetNum < 10000 ? Math.floor(act.cost * 0.7) : act.cost
        }))
      });
    }

    const calculatedCost = itineraryDays.reduce(
      (sum, day) => sum + day.schedule.reduce((dSum, act) => dSum + act.cost, 0), 0
    );

    return {
      title: `Grand Heritage Exploration: Starting in ${startingCity}`,
      days: itineraryDays,
      totalEstimatedCost: calculatedCost,
      travelTips: [
        `Drink bottled mineral water exclusively and keep hydrated in the dry desert climate.`,
        `Always hire government-licensed tour guides carrying ID badges at major forts.`,
        `Negotiate taxi and auto-rickshaw fares BEFORE starting the ride, or use app-based cabs.`,
        `Dress respectfully (shoulders and knees covered) when visiting temples and active shrines.`
      ]
    };
  },

  async getChatResponse(messageHistory) {
    if (ai) {
      try {
        const systemPrompt = `You are "Ask Rajasthan", the official AI Chat Assistant for RajasthanConnect. 
You are a warm, helpful, and highly educated local guide. You know everything about Rajasthan's history, food, dialects, customs, kings, festivals, hotels, shopping spots, and transport.
Keep your responses engaging, rich with local context, and formatting them beautifully in clean markdown. 
If asked to translate, translate accurately to/from Hindi, English, and local dialects like Marwari or Mewari. Include pronunciation hints.
Always reply directly, keeping answers concise but comprehensive.`;

        const compiledMessages = messageHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
        const finalPrompt = `${systemPrompt}\n\nHere is the ongoing conversation:\n${compiledMessages}\n\nAssistant:`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: finalPrompt,
        });

        const reply = response.text?.() || response.text || "I apologize, I'm having trouble processing that query right now.";
        return reply;
      } catch (err) {
        console.error('Gemini Chat API error, falling back:', err);
      }
    }

    const msg = messageHistory[messageHistory.length - 1].content.toLowerCase();

    // Use word-boundary regex so 'hi' in 'this/history/china' doesn't match greeting
    const hasWord = (words) => words.some(w => new RegExp(`\\b${w}\\b`).test(msg));

    // ── Language / Translation ── check FIRST (highest priority)
    if (hasWord(['translate','translation','say','speak','phrase','marwari','mewari','dhundhari','language','dialect','hindi','much','kitra','cost','price','how much'])) {
      return `In Rajasthan, local dialects change every few kilometers. **Marwari** is the most widely spoken, while **Dhundhari** is used around Jaipur and **Mewari** in Udaipur.

Here are essential phrases in **Marwari** to connect with locals:
* **Hello / Greetings:** *Khamma Ghani* (खम्मा घणी) — Reply: *Ghani Ghani Khamma*
* **How are you?** *The kaiya ho?* (थे काइयां हो?)
* **I am fine:** *Main chango hoon* (मैं चंगो हूँ)
* **Thank you:** *Aabhaar* (आभार) or *Dhanyawaad*
* **How much does this cost?** *Aa kitra ri hai?* (आ कितरा री है?)
* **Where is this?** *Aa kidhar hai?* (आ किधर है?)
* **Very beautiful!** *Bahut sundar!* (बहुत सुन्दर!)
* **Please help me:** *Mhari madad karo* (म्हारी मदद करो)

Locals are absolutely delighted when visitors try these phrases! Would you like me to translate a specific sentence?`;
    }

    // ── Greeting ──
    if (hasWord(['hello','hey','namaste','khamma','greet','howdy','hi'])) {
      return `**Khamma Ghani! 🙏** Welcome to RajasthanConnect!

I am your local digital guide. I can help you with:
1. Recommending historical sights in Jaipur, Jodhpur, Udaipur, or Jaisalmer.
2. Sharing traditional recipes like *Dal Baati Churma* or *Laal Maas*.
3. Explaining cultural traditions, music, dance (*Ghoomar*, *Kalbeliya*), and festivals.
4. Translating phrases in Marwari, Mewari, or Dhundhari dialects.
5. Answering travel queries, ticket prices, and suggested itineraries.

What part of our beautiful royal land are you interested in today?`;
    }

    // ── Food & Cuisine ──
    if (hasWord(['food','eat','recipe','cuisine','dish','restaurant','dal','baati','churma','laal','maas','kachori','thali','taste','drink','chai','rajasthani'])) {
      return `Traditional Rajasthani cuisine is rich, nutritious, and incredibly flavorful!

The crown jewel is **Dal Baati Churma**:
* **Baati**: Thick whole-wheat balls baked over coals, soaked in pure ghee.
* **Dal**: Five-lentil (*Panchmel*) stew spiced with Mathania chilies and asafoetida.
* **Churma**: Sweet coarsely ground wheat with dry fruits and cardamom.

**Other must-try dishes:**
* *Laal Maas* — Fiery mutton curry with Mathania chilies
* *Ker Sangri* — Desert bean stir-fry, the official state dish
* *Pyaz Kachori* — Flaky onion pastry from Jodhpur bakeries

**Best places:**
* Jaipur: Laxmi Misthan Bhandar (LMB), Chokhi Dhani village
* Udaipur: Krishna Dal Bati
* Jodhpur: Janta Sweet Home for Mirchi Vada

Would you like the full recipe or more restaurant suggestions?`;
    }

    // ── Forts & Palaces ──
    if (hasWord(['fort','palace','castle','amber','amer','mehrangarh','jaisalmer','chittorgarh','kumbhalgarh','monument','heritage','haveli','architecture'])) {
      return `Rajasthan houses some of India's most awe-inspiring fortresses!

**Top Forts to Visit:**
1. **Mehrangarh Fort, Jodhpur** — 410 feet tall on a sheer cliff. Cannonball marks on its gates tell stories of epic battles.
2. **Amber Fort, Jaipur** — Hindu-Rajput architecture on Aravalli hills. The *Sheesh Mahal* glows with a thousand mirrors.
3. **Jaisalmer Fort (Sonar Qila)** — A living golden sandstone fort. 3,000 people still live inside its 12th-century walls!
4. **Chittorgarh Fort** — India's largest fort. Site of the legendary *Jauhar* sacrifice by Rajput queens.
5. **Kumbhalgarh Fort** — Second-longest wall in the world after the Great Wall of China (38 km)!

*Tip:* Visit before 9 AM or after 5 PM to avoid the harsh sun.`;
    }

    // ── Festivals ──
    if (hasWord(['festival','fair','celebration','pushkar','gangaur','teej','diwali','holi','camel','mela','event','dance'])) {
      return `Rajasthan's festival calendar is one of the most vibrant in the world!

* 🐪 **Pushkar Camel Fair (Nov)** — World's largest camel fair. 50,000 camels, hot air balloons, folk music.
* 🌸 **Gangaur Festival (Mar–Apr)** — Women fast 18 days for Goddess Gauri. Colourful processions in Jaipur.
* 🌊 **Teej Festival (Aug)** — Monsoon festival of swings. Women in green celebrate Parvati and Shiva's reunion.
* 🌟 **Desert Festival, Jaisalmer (Jan–Feb)** — Camel races, turban-tying, folk performances on golden dunes.
* 🎨 **Lathmar Holi (Mar)** — Women chase men with sticks — a 5,000-year Rajasthani tradition!

Would you like travel tips or hotel suggestions for any specific festival?`;
    }

    // ── History & Kings ──
    if (hasWord(['history','king','queen','maharaja','maharani','rajput','dynasty','pratap','mughal','war','battle','ruler','empire','akbar','medieval'])) {
      return `Rajasthan's history is an epic saga of valour, sacrifice, and royal glory!

* ⚔️ **Battle of Haldighati (1576)** — Maharana Pratap fought Akbar's 80,000 army with just 22,000 soldiers. His horse *Chetak* became legend.
* 🏰 **Sisodia Clan of Mewar** — The oldest royal dynasty in the world (700 AD), ruling for 76 continuous generations!
* 🔥 **Jauhar of Chittorgarh** — Rajput queens performed mass self-sacrifice rather than face capture by invaders.
* 🌟 **Maharaja Sawai Jai Singh II** — Founded Jaipur in 1727 and built 5 astronomical observatories (*Jantar Mantar*) accurate to 2 seconds!

Would you like detailed chronicles about any specific ruler or battle?`;
    }

    // ── Default ──
    return `**Khamma Ghani! 🙏** Thank you for your question!

I can provide detailed answers on:
* 🏰 **Forts & Palaces** — Mehrangarh, Amber, Jaisalmer, Chittorgarh
* 🍛 **Food & Recipes** — Dal Baati Churma, Laal Maas, Ker Sangri
* 🎉 **Festivals** — Pushkar Fair, Gangaur, Teej, Desert Festival
* 🗣️ **Language** — Marwari, Mewari phrases and translations
* 👑 **History** — Rajput dynasties, battles, and royal palaces
* 🌡️ **Travel Tips** — Best time to visit, weather, and packing guide

Please ask your question in any of these areas and I will give you a detailed, helpful answer!`;
  }
};
