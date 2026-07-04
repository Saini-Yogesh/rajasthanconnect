import React from "react";
import "./EmptyState.css";

/**
 * No-results empty state with Rajasthan motif.
 * @param {string} title   - Main message
 * @param {string} message - Supporting text
 * @param {node}   [action]- Optional CTA button/link
 */
export default function EmptyState({
  title = "Nothing found here",
  message = "Try adjusting your search or filters.",
  action,
}) {
  return (
    <div className="emptyState">
      <div className="emptyStateIcon" aria-hidden="true">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stylised fort silhouette */}
          <rect x="10" y="45" width="60" height="25" rx="2" fill="var(--color-border)" />
          <rect x="10" y="35" width="10" height="15" rx="1" fill="var(--color-border)" />
          <rect x="35" y="30" width="10" height="20" rx="1" fill="var(--color-border)" />
          <rect x="60" y="35" width="10" height="15" rx="1" fill="var(--color-border)" />
          <rect x="8" y="40" width="64" height="6" rx="1" fill="rgba(180,83,9,0.15)" />
          {/* Battlements */}
          {[10, 16, 22, 28, 34, 48, 54, 60, 66, 72].map((x) => (
            <rect key={x} x={x} y="33" width="4" height="6" rx="1" fill="var(--color-border)" />
          ))}
          {/* Sun */}
          <circle cx="64" cy="20" r="8" fill="rgba(194,65,12,0.15)" />
          <circle cx="64" cy="20" r="5" fill="rgba(194,65,12,0.25)" />
        </svg>
      </div>
      <h3 className="emptyStateTitle">{title}</h3>
      <p className="emptyStateMessage">{message}</p>
      {action && <div className="emptyStateAction">{action}</div>}
    </div>
  );
}
