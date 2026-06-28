import { useEffect } from 'react';

/**
 * Custom hook to dynamically update page meta tags and inject JSON-LD schemas for maximum SEO indexability.
 */
export default function useSEO({ title, description, keywords, image, url, schema }) {
  useEffect(() => {
    // 1. Document Title
    const baseTitle = "Rajasthan Connect — Connecting Heritage, Tour Guides & Stays";
    if (title) {
      document.title = `${title} | Rajasthan Connect`;
    } else {
      document.title = baseTitle;
    }

    // Helper to update or create meta tags
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update link canonical tag
    const updateCanonical = (href) => {
      if (!href) return;
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Primary Meta Tags
    const fallbackDesc = "Discover Rajasthan's rich culture, book local verified tour guides, reserve heritage stays, and explore majestic sand dunes. Your direct gateway to the land of kings.";
    const fallbackKeywords = "Rajasthan connect, Rajasthan tour guides, Jaisalmer camel safari, Udaipur heritage hotels, Jaipur local guide, Rajasthan artisans, Blue pottery Jaipur, Dal Baati Churma, Rajasthan tourism portal";
    
    updateMetaTag('meta[name="description"]', 'name', 'description', description || fallbackDesc);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords || fallbackKeywords);

    // 3. Open Graph Tags (WhatsApp, Facebook sharing previews)
    const ogTitle = title ? `${title} | Rajasthan Connect` : baseTitle;
    const ogDesc = description || fallbackDesc;
    const ogImg = image || "https://www.rajasthanconnect.in/images/jaipur.webp";
    const ogUrl = url || window.location.href;

    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', ogTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', ogDesc);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImg);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', ogUrl);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // 4. Twitter Tags
    updateMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', ogTitle);
    updateMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', ogDesc);
    updateMetaTag('meta[property="twitter:image"]', 'property', 'twitter:image', ogImg);
    updateMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', ogUrl);
    updateMetaTag('meta[property="twitter:card"]', 'property', 'twitter:card', 'summary_large_image');

    // 5. Canonical link tag
    updateCanonical(ogUrl);

    // 6. Structured Schema JSON-LD injection
    let scriptTag = document.getElementById('dynamic-jsonld-schema');
    if (scriptTag) {
      scriptTag.remove();
    }

    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      scriptTag.innerHTML = JSON.stringify(schema);
      document.body.appendChild(scriptTag);
    }

    // Cleanup schema script on unmount
    return () => {
      const tag = document.getElementById('dynamic-jsonld-schema');
      if (tag) {
        tag.remove();
      }
    };

  }, [title, description, keywords, image, url, schema]);
}
