/**
 * Safely normalize any value for text search (handles null, numbers, arrays).
 */
export function toSearchText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).toLowerCase();
  }
  if (Array.isArray(value)) {
    return value.map(toSearchText).join(" ");
  }
  return String(value).toLowerCase();
}

/** True when query is empty or any field contains the query (case-insensitive). */
export function matchesSearch(query, ...fields) {
  if (!query?.trim()) return true;
  const q = query.toLowerCase();
  return fields.some((field) => toSearchText(field).includes(q));
}
