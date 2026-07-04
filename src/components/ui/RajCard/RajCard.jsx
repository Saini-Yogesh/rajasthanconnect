import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import "./RajCard.css";

/**
 * Universal Rajasthan-themed card for list pages.
 * Handles image, badge, title, subtitle, description, and link.
 *
 * @param {string}  image       - Background image URL
 * @param {string}  [badge]     - Top-left badge text (e.g. category)
 * @param {string}  [badgeColor]- Custom badge hex color
 * @param {string}  title
 * @param {string}  [subtitle]  - Small italic text (e.g. location)
 * @param {string}  [description]
 * @param {string}  to          - React Router link path
 * @param {string}  [linkText]  - CTA text (default "Explore →")
 * @param {string[]} [tags]     - Array of tag strings
 */
export default function RajCard({
  image,
  badge,
  badgeColor,
  title,
  subtitle,
  description,
  to,
  linkText = "Explore →",
  tags = [],
}) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80";

  return (
    <Link to={to} className="rajCard" aria-label={`Explore ${title}`}>
      {/* Image */}
      <div
        className="rajCardImage"
        style={{ backgroundImage: `url(${image || fallbackImage})` }}
      >
        <div className="rajCardImageOverlay" />
        {badge && (
          <span
            className="rajCardBadge"
            style={badgeColor ? { background: badgeColor } : undefined}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="rajCardBody">
        <h3 className="rajCardTitle">{title}</h3>
        {subtitle && (
          <p className="rajCardSubtitle">
            <MapPin size={12} aria-hidden="true" /> {subtitle}
          </p>
        )}
        {description && (
          <p className="rajCardDesc">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="rajCardTags">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="rajCardTag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="rajCardLink">
          {linkText} <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
