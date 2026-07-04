import { supabase } from "../config/db.js";

// Input Validation Helper for Business Listings
export const validateListingData = (data) => {
  const errors = [];
  const { businessName, category, city, phone, description } = data;

  // Validate Business Name
  if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 3 || businessName.trim().length > 100) {
    errors.push('Business Name must be between 3 and 100 characters.');
  }

  // Validate Category
  const allowedCategories = ['Guides', 'Hotels', 'Restaurants', 'Shops', 'Transport'];
  if (!category || !allowedCategories.includes(category)) {
    errors.push(`Category must be one of: ${allowedCategories.join(', ')}.`);
  }

  // Validate City (supports all major cities now, not just a hardcoded list)
  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    errors.push('City name is required.');
  }

  // Validate Phone number (standard local/intl formats with digits, space, -, (, ))
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    errors.push('Phone number is invalid. Please use a valid format (e.g. +91 98765 43210).');
  }

  // Validate Description
  if (!description || typeof description !== 'string' || description.trim().length < 20 || description.trim().length > 1000) {
    errors.push('Description must be between 20 and 1000 characters to verify services.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get all listings (supports city_id and category filters)
 */
export const getListings = async (req, res) => {
  try {
    const { cityId, category } = req.query;
    let query = supabase.from("directory_listings").select("*");

    if (cityId) {
      query = query.eq("city_id", cityId.toLowerCase());
    }
    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create a new business directory listing and notify via EmailJS
 */
export const createListing = async (req, res) => {
  try {
    const { businessName, category, city, phone, description } = req.body;

    const validation = validateListingData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    // Insert listing into Supabase table
    const { data, error } = await supabase
      .from("directory_listings")
      .insert([{
        city_id: city.toLowerCase(),
        title: businessName,
        category: category,
        subcategory: category === "Guides" ? "Tour Guide" : "Services",
        rating: 5.0,
        location_address: `${city}, Rajasthan`,
        contact_phone: phone,
        whatsapp: phone,
        description: description,
        pricing: "Contact for pricing",
        is_verified: false
      }])
      .select();

    if (error) throw error;

    // Send email using EmailJS if configured
    try {
      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const requestBody = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            businessName,
            category,
            city,
            phone,
            description,
          },
        };
        if (process.env.EMAILJS_PRIVATE_KEY) {
          requestBody.accessToken = process.env.EMAILJS_PRIVATE_KEY;
        }
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
      }
    } catch (emailErr) {
      console.error("EmailJS notification error:", emailErr);
    }

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
