/** Remove duplicate values from an array (keeps first occurrence). */
export function uniqueValues(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr)];
}
