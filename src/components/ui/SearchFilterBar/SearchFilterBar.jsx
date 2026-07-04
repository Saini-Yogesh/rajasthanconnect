import React from "react";
import { Search } from "lucide-react";
import "./SearchFilterBar.css";

/**
 * Reusable search + chip-filter bar.
 * @param {string}    searchTerm
 * @param {function}  onSearch
 * @param {string}    placeholder
 * @param {string[]}  [filters]        - Array of filter chip labels
 * @param {string}    [activeFilter]
 * @param {function}  [onFilterChange]
 */
export default function SearchFilterBar({
  searchTerm,
  onSearch,
  placeholder = "Search...",
  filters = [],
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="searchFilterBar">
      <div className="searchInputWrapper">
        <Search className="searchBarIcon" size={18} aria-hidden="true" />
        <input
          type="text"
          className="searchBarInput"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          aria-label={placeholder}
        />
      </div>

      {filters.length > 0 && (
        <div className="filterChips" role="group" aria-label="Filter options">
          {filters.map((f) => (
            <button
              key={f}
              className={`filterChip ${activeFilter === f ? "filterChip--active" : ""}`}
              onClick={() => onFilterChange?.(f)}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
