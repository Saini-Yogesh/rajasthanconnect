# 🗂️ Rajasthan Connect - Available Datasets Index

This document serves as the official data registry and directory index for the **Rajasthan Connect** application. It catalogues all **19 available JSON datasets** mapping the rich culture, history, heritage, geography, and travel experiences of Rajasthan.

---

## 📊 Summary of Datasets

| # | Category | Data File | Structure | Item Count | Key Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Festivals & Fairs** | [rajasthan_festivals.json](rajasthan_festivals.json) | Array of Strings | **76** | Gangaur, Teej, Pushkar Camel Fair, Desert Festival |
| **2** | **Cuisine & Sweets** | [rajasthan_cuisines.json](rajasthan_cuisines.json) | Array of Strings | **70** | Dal Baati Churma, Ker Sangri, Ghevar, Laal Maas |
| **3** | **Districts & Cities** | [rajasthan_districts_and_cities.json](rajasthan_districts_and_cities.json) | Object (Arrays) | **48** districts<br>**40** cities | All administrative districts and primary cities |
| **4** | **Forts & Palaces** | [rajasthan_forts_palaces.json](rajasthan_forts_palaces.json) | Object (Arrays) | **20** forts<br>**20** palaces | Amber Fort, Mehrangarh, Hawa Mahal, Umaid Bhawan |
| **5** | **Temples & Religious Sites** | [rajasthan_temples_religious_sites.json](rajasthan_temples_religious_sites.json) | Array of Strings | **40** | Brahma Temple, Khatu Shyam Ji, Dilwara Jain |
| **6** | **Rajput Dynasties & Kings** | [rajasthan_rajput_dynasties_kings.json](rajasthan_rajput_dynasties_kings.json) | Object (Arrays) | **15** dynasties<br>**50** rulers | Sisodias, Rathores, Maharana Pratap, Sawai Jai Singh |
| **7** | **Historical Events & Legends** | [rajasthan_historical_events_legends.json](rajasthan_historical_events_legends.json) | Array of Strings | **40** | Battle of Haldighati, Legends of Panna Dai & Padmini |
| **8** | **Folk Arts & Attire** | [rajasthan_folk_arts_attire.json](rajasthan_folk_arts_attire.json) | Object (Arrays) | **31** arts<br>**28** attires | Ghoomar, Kalbelia, Phad Painting, Safa, Ghagra |
| **9** | **Folk Music & Instruments** | [rajasthan_folk_music_instruments.json](rajasthan_folk_music_instruments.json) | Object (Arrays) | **15** music styles<br>**15** instruments | Maand, Ravanhatta, Kamayacha, Khartal, Morchang |
| **10** | **Handicrafts & Crafts** | [rajasthan_handicrafts_traditional_crafts.json](rajasthan_handicrafts_traditional_crafts.json) | Array of Strings | **40** | Blue Pottery, Bandhani, Thewa, Sanganeri Prints |
| **11** | **Languages & Dialects** | [rajasthan_languages.json](rajasthan_languages.json) | Array of Strings | **17** | Marwari, Mewari, Dhundhari, Shekhawati |
| **12** | **Wildlife & National Parks** | [rajasthan_wildlife_national_parks.json](rajasthan_wildlife_national_parks.json) | Object (Arrays) | **32** total reserves | Ranthambore (Tiger), Tal Chhapar (Blackbuck) |
| **13** | **Royal Wedding Venues** | [rajasthan_royal_wedding_venues.json](rajasthan_royal_wedding_venues.json) | Array of Strings | **25** | Taj Lake Palace, Udaivilas, Tijara Fort, Suryagarh |
| **14** | **Unique Experiences** | [rajasthan_unique_experiences.json](rajasthan_unique_experiences.json) | Array of Strings | **35** | Camel Safari, Dune Camping, Stepwell Tours |
| **15** | **UNESCO Heritage Sites** | [rajasthan_unesco_heritage_sites.json](rajasthan_unesco_heritage_sites.json) | Array of Strings | **10** | Jantar Mantar, Keoladeo NP, Walled City of Jaipur |
| **16** | **Lakes & Water Bodies** | [rajasthan_lakes_water_bodies.json](rajasthan_lakes_water_bodies.json) | Array of Strings | **15** | Pichola, Fateh Sagar, Nakki Lake, Sambhar Salt Lake |
| **17** | **Hills & Natural Attractions** | [rajasthan_hills_natural_attractions.json](rajasthan_hills_natural_attractions.json) | Array of Strings | **15** | Guru Shikhar (Mount Abu), Sam Sand Dunes, Jawai Hills |
| **18** | **Culture & Pilgrimage** | [rajasthan_cultural_etiquette_pilgrimage.json](rajasthan_cultural_etiquette_pilgrimage.json) | Object (Arrays) | **15** etiquette rules<br>**20** sites | Khamma Ghani, coverings head, Ajmer Sharif, Pushkar |
| **19** | **Communities & Tribes** | [rajasthan_communities_tribes.json](rajasthan_communities_tribes.json) | Array of Strings | **25** | Bhils, Meenas, Bishnois, Kalbelias, Manganiyars |

---

## 📂 Detailed File Index

### 1. Festivals & Fairs
* **Filename**: [rajasthan_festivals.json](rajasthan_festivals.json)
* **Structure**: Array of strings (Distinct Festival Names)
* **Count**: 76 items

### 2. Cuisine & Sweets
* **Filename**: [rajasthan_cuisines.json](rajasthan_cuisines.json)
* **Structure**: Array of strings
* **Count**: 70 items

### 3. Districts & Cities
* **Filename**: [rajasthan_districts_and_cities.json](rajasthan_districts_and_cities.json)
* **Structure**:
  ```json
  {
    "districts": [ ... ],
    "major_cities": [ ... ]
  }
  ```
* **Count**: 48 districts, 40 major cities

### 4. Forts & Palaces
* **Filename**: [rajasthan_forts_palaces.json](rajasthan_forts_palaces.json)
* **Structure**:
  ```json
  {
    "forts": [ ... ],
    "palaces": [ ... ]
  }
  ```
* **Count**: 20 forts, 20 palaces/havelis

### 5. Temples & Religious Sites
* **Filename**: [rajasthan_temples_religious_sites.json](rajasthan_temples_religious_sites.json)
* **Structure**: Array of strings
* **Count**: 40 items

### 6. Rajput Dynasties & Kings
* **Filename**: [rajasthan_rajput_dynasties_kings.json](rajasthan_rajput_dynasties_kings.json)
* **Structure**:
  ```json
  {
    "dynasties": [ ... ],
    "kings": [ ... ]
  }
  ```
* **Count**: 15 dynasties, 50 kings/rulers

### 7. Historical Events & Legends
* **Filename**: [rajasthan_historical_events_legends.json](rajasthan_historical_events_legends.json)
* **Structure**: Array of strings
* **Count**: 40 items (events and regional legends)

### 8. Folk Arts & Attire
* **Filename**: [rajasthan_folk_arts_attire.json](rajasthan_folk_arts_attire.json)
* **Structure**:
  ```json
  {
    "folk_arts": [ ... ],
    "attire": [ ... ]
  }
  ```
* **Count**: 31 folk arts, 28 attire items

### 9. Folk Music & Instruments
* **Filename**: [rajasthan_folk_music_instruments.json](rajasthan_folk_music_instruments.json)
* **Structure**:
  ```json
  {
    "folk_music": [ ... ],
    "instruments": [ ... ]
  }
  ```
* **Count**: 15 music styles, 15 traditional instruments

### 10. Handicrafts & Traditional Crafts
* **Filename**: [rajasthan_handicrafts_traditional_crafts.json](rajasthan_handicrafts_traditional_crafts.json)
* **Structure**: Array of strings
* **Count**: 40 items

### 11. Languages & Dialects
* **Filename**: [rajasthan_languages.json](rajasthan_languages.json)
* **Structure**: Array of strings
* **Count**: 17 items

### 12. Wildlife & National Parks
* **Filename**: [rajasthan_wildlife_national_parks.json](rajasthan_wildlife_national_parks.json)
* **Structure**:
  ```json
  {
    "national_parks": [ ... ],
    "tiger_reserves": [ ... ],
    "wildlife_sanctuaries": [ ... ],
    "bird_sanctuaries": [ ... ]
  }
  ```
* **Count**: 4 national parks, 4 tiger reserves, 12 sanctuaries, 4 bird areas (32 total)

### 13. Royal Wedding & Destination Venues
* **Filename**: [rajasthan_royal_wedding_venues.json](rajasthan_royal_wedding_venues.json)
* **Structure**: Array of strings
* **Count**: 25 venues

### 14. Unique Rajasthan Experiences
* **Filename**: [rajasthan_unique_experiences.json](rajasthan_unique_experiences.json)
* **Structure**: Array of strings
* **Count**: 35 items

### 15. UNESCO & Heritage Sites
* **Filename**: [rajasthan_unesco_heritage_sites.json](rajasthan_unesco_heritage_sites.json)
* **Structure**: Array of strings
* **Count**: 10 items

### 16. Lakes & Water Bodies
* **Filename**: [rajasthan_lakes_water_bodies.json](rajasthan_lakes_water_bodies.json)
* **Structure**: Array of strings
* **Count**: 15 items

### 17. Hills & Natural Attractions
* **Filename**: [rajasthan_hills_natural_attractions.json](rajasthan_hills_natural_attractions.json)
* **Structure**: Array of strings
* **Count**: 15 items

### 18. Cultural Etiquette & Pilgrimage
* **Filename**: [rajasthan_cultural_etiquette_pilgrimage.json](rajasthan_cultural_etiquette_pilgrimage.json)
* **Structure**:
  ```json
  {
    "cultural_etiquette": [ ... ],
    "pilgrimage_sites": [ ... ]
  }
  ```
* **Count**: 15 etiquette rules, 20 pilgrimage sites

### 19. Communities & Tribes
* **Filename**: [rajasthan_communities_tribes.json](rajasthan_communities_tribes.json)
* **Structure**: Array of strings
* **Count**: 25 items

---
