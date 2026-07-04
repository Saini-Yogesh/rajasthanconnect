import { supabase } from "../config/db.js";

// Helper to map folk arts to legacy culture topic format
const mapFolkArt = (item) => ({
  id: item.id,
  category: item.category || "Performance Art",
  title: item.name,
  description: item.history_origin,
  image_url: item.image_url,
  details: {
    origin: item.origin_region,
    instruments: item.instruments_used?.join(", ") || "None",
    exponents: item.key_exponents?.join(", ") || "None"
  },
  related_city_ids: item.related_city_ids || [],
  related_festival_ids: item.related_festival_ids || []
});

// Helper to map handicrafts to legacy culture topic format
const mapHandicraft = (item) => ({
  id: item.id,
  category: "Crafts",
  title: item.name,
  description: item.process_description,
  image_url: item.image_url,
  details: {
    materials: item.materials_used?.join(", ") || "Various",
    gi_tag: item.gi_tag_status ? `Yes (${item.gi_tag_year || 'Active'})` : "No",
    artisans: item.famous_artisans?.join(", ") || "Local Guilds"
  },
  related_city_ids: item.origin_city_id ? [item.origin_city_id] : [],
  related_festival_ids: []
});

// Helper to map attire to legacy culture topic format
const mapAttire = (item) => ({
  id: item.id,
  category: "Clothing & Attire",
  title: item.name,
  description: item.cultural_significance,
  image_url: item.image_url,
  details: {
    worn_by: item.worn_by,
    fabrics: item.material_fabrics?.join(", ") || "Traditional",
    occasions: item.wearing_style_occasions || "Festivals"
  },
  related_city_ids: [],
  related_festival_ids: []
});

/**
 * Get all combined culture topics (folk arts, handicrafts, attire) mapped to the legacy format
 */
export const getCulture = async (req, res) => {
  try {
    const [artsRes, craftsRes, attireRes] = await Promise.all([
      supabase.from("folk_arts").select("*"),
      supabase.from("handicrafts").select("*"),
      supabase.from("attire").select("*")
    ]);

    if (artsRes.error) throw artsRes.error;
    if (craftsRes.error) throw craftsRes.error;
    if (attireRes.error) throw attireRes.error;

    const mappedArts = (artsRes.data || []).map(mapFolkArt);
    const mappedCrafts = (craftsRes.data || []).map(mapHandicraft);
    const mappedAttire = (attireRes.data || []).map(mapAttire);

    const combined = [...mappedArts, ...mappedCrafts, ...mappedAttire];
    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific culture topic by looking it up in folk_arts, handicrafts, or attire
 */
export const getCultureById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Try Folk Arts
    const artQuery = await supabase.from("folk_arts").select("*").eq("id", id).maybeSingle();
    if (artQuery.data) {
      return res.json(mapFolkArt(artQuery.data));
    }

    // 2. Try Handicrafts
    const craftQuery = await supabase.from("handicrafts").select("*").eq("id", id).maybeSingle();
    if (craftQuery.data) {
      return res.json(mapHandicraft(craftQuery.data));
    }

    // 3. Try Attire
    const attireQuery = await supabase.from("attire").select("*").eq("id", id).maybeSingle();
    if (attireQuery.data) {
      return res.json(mapAttire(attireQuery.data));
    }

    res.status(404).json({ error: "Culture topic not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
