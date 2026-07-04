import React from "react";
import "./LoadingSpinner.css";

/**
 * Rajasthan-branded mandala loading spinner.
 * @param {string} [message] - Optional loading message
 * @param {string} [size]    - "sm" | "md" (default) | "lg"
 */
export default function LoadingSpinner({ message = "Loading...", size = "md" }) {
  return (
    <div className={`spinnerWrapper spinnerWrapper--${size}`} role="status" aria-label={message}>
      <div className="mandalaSpinner">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mandalaSvg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="8 4" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="3 5" />
          {/* Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="28"
              rx="5"
              ry="9"
              fill="var(--color-primary)"
              fillOpacity="0.3"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="var(--color-primary)" fillOpacity="0.8" />
        </svg>
      </div>
      {message && <p className="spinnerMessage">{message}</p>}
    </div>
  );
}
