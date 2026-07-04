import React from "react";
import "./PageHeader.css";

/**
 * Reusable Rajasthan-themed page header banner.
 * Used at the top of every list and detail page.
 *
 * @param {string}  title     - Main heading
 * @param {string}  subtitle  - Supporting description text
 * @param {string}  [badge]   - Optional small badge text above title
 * @param {node}    [children]- Optional slot (e.g. search bar)
 */
export default function PageHeader({ title, subtitle, badge, children }) {
  return (
    <header className="pageHeader">
      <div className="pageHeaderJali" aria-hidden="true" />
      <div className="pageHeaderContent">
        {badge && <span className="pageHeaderBadge">{badge}</span>}
        <h1 className="pageHeaderTitle">{title}</h1>
        {subtitle && <p className="pageHeaderSubtitle">{subtitle}</p>}
        {children && <div className="pageHeaderSlot">{children}</div>}
      </div>
      <div className="pageHeaderOrnament" aria-hidden="true">
        <svg viewBox="0 0 400 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 12 Q50 0 100 12 Q150 24 200 12 Q250 0 300 12 Q350 24 400 12"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    </header>
  );
}
