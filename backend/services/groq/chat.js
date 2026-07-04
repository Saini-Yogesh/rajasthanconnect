import { callGroq, isGroqConfigured } from "./client.js";

const CHAT_SYSTEM_PROMPT = `You are "Ask Rajasthan", the official AI travel guide for RajasthanConnect (rajasthanconnect.in).

YOUR SCOPE — answer ONLY about Rajasthan, India:
- History, Rajput rulers, dynasties, forts and palaces
- Food, recipes, restaurants, and local cuisine
- Festivals, fairs, folk music, dance, and handicrafts
- Marwari, Mewari, Dhundhari dialects and useful phrases
- Travel tips, etiquette, dress codes, markets, and sightseeing
- Cities: Jaipur, Jodhpur, Udaipur, Jaisalmer, Pushkar, Bikaner, Ajmer, and more

STRICT OUTPUT RULES:
- Plain text markdown ONLY: ### headings, **bold**, - bullet lists
- NEVER output code blocks, inline code, JSON, SQL, HTML, or programming examples
- NEVER include images, image links, or URLs to photos
- NEVER use ASCII separator lines (===== or -----) — use headings instead
- NEVER discuss technology, AI, coding, crypto, politics, or topics unrelated to Rajasthan
- Keep answers warm, concise, and practical for tourists

OFF-TOPIC HANDLING:
If the user asks about anything outside Rajasthan travel and culture, reply:
"**Khamma Ghani! 🙏** I specialize in Rajasthan heritage, food, festivals, and travel. Please ask me about forts, local dishes, festivals, dialect phrases, or trip tips!"`;

const OFF_TOPIC_REPLY =
  "**Khamma Ghani! 🙏** I specialize in Rajasthan heritage, food, festivals, and travel. Please ask me about forts, local dishes, festivals, dialect phrases, or trip tips!";

/** Strip code, images, and non-text artifacts the model may still emit. */
export function sanitizeChatReply(text) {
  if (!text) return text;

  let cleaned = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]+`/g, (match) => match.slice(1, -1))
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/https?:\/\/\S+\.(png|jpe?g|gif|webp|svg|bmp)(\?\S*)?/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned || OFF_TOPIC_REPLY;
}

function getMockChatResponse(messageHistory) {
  const msg = messageHistory[messageHistory.length - 1].content.toLowerCase();
  const hasWord = (words) => words.some((w) => new RegExp(`\\b${w}\\b`).test(msg));

  if (hasWord(["translate", "translation", "say", "speak", "phrase", "marwari", "mewari", "dhundhari", "language", "dialect", "hindi", "much", "kitra", "cost", "price", "how much"])) {
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

  if (hasWord(["hello", "hey", "namaste", "khamma", "greet", "howdy", "hi"])) {
    return `**Khamma Ghani! 🙏** Welcome to RajasthanConnect!

I am your local digital guide. I can help you with:
1. Recommending historical sights in Jaipur, Jodhpur, Udaipur, or Jaisalmer.
2. Sharing traditional recipes like *Dal Baati Churma* or *Laal Maas*.
3. Explaining cultural traditions, music, dance (*Ghoomar*, *Kalbeliya*), and festivals.
4. Translating phrases in Marwari, Mewari, or Dhundhari dialects.
5. Answering travel queries, ticket prices, and suggested itineraries.

What part of our beautiful royal land are you interested in today?`;
  }

  if (hasWord(["food", "eat", "recipe", "cuisine", "dish", "restaurant", "dal", "baati", "churma", "laal", "maas", "kachori", "thali", "taste", "drink", "chai", "rajasthani"])) {
    return `Traditional Rajasthani cuisine is rich, nutritious, and incredibly flavorful!

The crown jewel is **Dal Baati Churma**:
* **Baati**: Thick whole-wheat balls baked over coals, soaked in pure ghee.
* **Dal**: Five-lentil (*Panchmel*) stew spiced with Mathania chilies and asafoetida.
* **Churma**: Sweet coarsely ground wheat with dry fruits and cardamom.

**Other must-try dishes:**
* *Laal Maas* — Fiery mutton curry with Mathania chilies
* *Ker Sangri* — Desert bean stir-fry, the official state dish
* *Pyaz Kachori* — Flaky onion pastry from Jodhpur bakeries

Would you like the full recipe or more restaurant suggestions?`;
  }

  if (hasWord(["fort", "palace", "castle", "amber", "amer", "mehrangarh", "jaisalmer", "chittorgarh", "kumbhalgarh", "monument", "heritage", "haveli", "architecture"])) {
    return `Rajasthan houses some of India's most awe-inspiring fortresses!

**Top Forts to Visit:**
1. **Mehrangarh Fort, Jodhpur** — 410 feet tall on a sheer cliff.
2. **Amber Fort, Jaipur** — Hindu-Rajput architecture on Aravalli hills.
3. **Jaisalmer Fort (Sonar Qila)** — A living golden sandstone fort.
4. **Chittorgarh Fort** — India's largest fort.
5. **Kumbhalgarh Fort** — Second-longest wall in the world after the Great Wall of China!

*Tip:* Visit before 9 AM or after 5 PM to avoid the harsh sun.`;
  }

  if (hasWord(["festival", "fair", "celebration", "pushkar", "gangaur", "teej", "diwali", "holi", "camel", "mela", "event", "dance"])) {
    return `Rajasthan's festival calendar is one of the most vibrant in the world!

* 🐪 **Pushkar Camel Fair (Nov)** — World's largest camel fair.
* 🌸 **Gangaur Festival (Mar–Apr)** — Women fast 18 days for Goddess Gauri.
* 🌊 **Teej Festival (Aug)** — Monsoon festival of swings.
* 🌟 **Desert Festival, Jaisalmer (Jan–Feb)** — Camel races and folk performances on golden dunes.

Would you like travel tips for any specific festival?`;
  }

  if (hasWord(["history", "king", "queen", "maharaja", "maharani", "rajput", "dynasty", "pratap", "mughal", "war", "battle", "ruler", "empire", "akbar", "medieval"])) {
    return `Rajasthan's history is an epic saga of valour, sacrifice, and royal glory!

* ⚔️ **Battle of Haldighati (1576)** — Maharana Pratap fought Akbar's army. His horse *Chetak* became legend.
* 🏰 **Sisodia Clan of Mewar** — One of the oldest royal dynasties in the region.
* 🌟 **Maharaja Sawai Jai Singh II** — Founded Jaipur in 1727 and built the Jantar Mantar observatories.

Would you like detailed chronicles about any specific ruler or battle?`;
  }

  return OFF_TOPIC_REPLY;
}

/**
 * Get a Rajasthan-focused text-only chat reply.
 */
export async function getChatResponse(messageHistory) {
  if (isGroqConfigured()) {
    try {
      const messages = [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...messageHistory.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      const reply = await callGroq(messages, { temperature: 0.35 });
      if (reply) return sanitizeChatReply(reply);
    } catch (err) {
      console.error("Groq chat failed:", err.message);
    }
  }

  return getMockChatResponse(messageHistory);
}
