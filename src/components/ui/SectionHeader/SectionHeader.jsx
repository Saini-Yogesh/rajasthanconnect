import React from "react";
import "./SectionHeader.css";

/**
 * Decorated section header with ornamental divider.
 * @param {string} title
 * @param {string} [subtitle]
 * @param {string} [align] - "left" | "center" (default)
 * @param {string} [variant] - "light" (default) | "dark"
 */
export default function SectionHeader({ title, subtitle, align = "center", variant = "light" }) {
  return (
    <div className={`sectionHeader sectionHeader--${align} sectionHeader--${variant}`}>
      <div className="sectionHeaderOrnament" aria-hidden="true">
        <span className="ornamentLine" />
        <span className="ornamentDiamond">◆</span>
        <span className="ornamentLine" />
      </div>
      <h2 className="sectionHeaderTitle">{title}</h2>
      {subtitle && <p className="sectionHeaderSubtitle">{subtitle}</p>}
    </div>
  );
}
