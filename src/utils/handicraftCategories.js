/**
 * Handicrafts in the DB have no category column — infer from craft name/materials.
 */
const CATEGORY_RULES = [
  {
    category: "Pottery",
    keywords: ["pottery", "terracotta", "clay", "blue pottery"],
  },
  {
    category: "Painting",
    keywords: [
      "painting",
      "pichwai",
      "phad",
      "mandana",
      "miniature",
      "emboss",
      "usta",
    ],
  },
  {
    category: "Jewellery",
    keywords: [
      "jewellery",
      "jewelry",
      "kundan",
      "meenakari",
      "silver jewellery",
      "lac bangle",
      "gemstone",
      "thewa",
    ],
  },
  {
    category: "Stone",
    keywords: ["marble", "stone carving"],
  },
  {
    category: "Metal",
    keywords: ["brass", "metal craft", "metal engraving"],
  },
  {
    category: "Wood",
    keywords: ["wood carving", "bamboo", "kathputli", "puppet"],
  },
  {
    category: "Textile",
    keywords: [
      "bandhani",
      "block print",
      "leheriya",
      "kota doria",
      "gota patti",
      "zari",
      "embroidery",
      "applique",
      "patchwork",
      "carpet",
      "dhurrie",
      "durrie",
      "leather",
      "mojari",
      "weaving",
      "paper craft",
    ],
  },
];

export function getHandicraftCategory(item) {
  if (item?.category) return item.category;

  const nameText = [item?.name, item?.id].filter(Boolean).join(" ").toLowerCase();
  const fromName = matchCategory(nameText);
  if (fromName) return fromName;

  const fullText = [
    nameText,
    ...(Array.isArray(item?.materials_used) ? item.materials_used : []),
  ]
    .join(" ")
    .toLowerCase();

  return matchCategory(fullText) || "Craft";
}

function matchCategory(text) {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }
  return null;
}

export function enrichHandicraft(item) {
  const category = getHandicraftCategory(item);
  const originCity = item.origin_city_id
    ? item.origin_city_id.charAt(0).toUpperCase() +
      item.origin_city_id.slice(1).replace(/-/g, " ")
    : item.origin_city || item.origin;

  return {
    ...item,
    category,
    description:
      item.process_description ||
      item.description ||
      (Array.isArray(item.materials_used)
        ? `Materials: ${item.materials_used.slice(0, 4).join(", ")}`
        : ""),
    origin_city: originCity,
  };
}
