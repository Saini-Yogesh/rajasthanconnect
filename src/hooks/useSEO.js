import { useEffect } from "react";
import { SITE } from "../utils/seo";

/**
 * Dynamically updates title, meta tags, canonical URL, robots, and JSON-LD schema.
 * Pass a config object from LIST_SEO or build*SEO() helpers in utils/seo.js.
 */
export default function useSEO({
  title,
  description,
  keywords,
  image,
  url,
  schema,
  robots = "index, follow",
  type = "website",
}) {
  useEffect(() => {
    const baseTitle = `${SITE.name} — Rajasthan Tourism, Culture & Travel Guide`;
    const fullTitle = title ? `${title} | ${SITE.name}` : baseTitle;
    document.title = fullTitle;

    const setMeta = (selector, attrName, attrValue, content) => {
      if (content == null || content === "") return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const fallbackDesc =
      "Explore Rajasthan — cities, forts, festivals, food, handicrafts & verified local guides. Your complete travel guide to the Land of Kings.";
    const fallbackKeywords =
      "Rajasthan tourism, Rajasthan travel guide, Jaipur Udaipur Jaisalmer, Rajasthan festivals, Rajasthani food, things to do Rajasthan";

    const desc = description || fallbackDesc;
    const kw = keywords || fallbackKeywords;
    const img = image || SITE.defaultImage;
    const pageUrl = url || window.location.href;

    setMeta('meta[name="description"]', "name", "description", desc);
    setMeta('meta[name="keywords"]', "name", "keywords", kw);
    setMeta('meta[name="robots"]', "name", "robots", robots);
    setMeta('meta[name="geo.region"]', "name", "geo.region", "IN-RJ");
    setMeta('meta[name="geo.placename"]', "name", "geo.placename", "Rajasthan, India");

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", desc);
    setMeta('meta[property="og:image"]', "property", "og:image", img);
    setMeta('meta[property="og:url"]', "property", "og:url", pageUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE.name);
    setMeta('meta[property="og:locale"]', "property", "og:locale", SITE.locale);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", img);
    setMeta('meta[name="twitter:url"]', "name", "twitter:url", pageUrl);

    setLink("canonical", pageUrl);

    const existing = document.getElementById("dynamic-jsonld-schema");
    if (existing) existing.remove();

    if (schema) {
      const script = document.createElement("script");
      script.id = "dynamic-jsonld-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById("dynamic-jsonld-schema")?.remove();
    };
  }, [title, description, keywords, image, url, schema, robots, type]);
}
