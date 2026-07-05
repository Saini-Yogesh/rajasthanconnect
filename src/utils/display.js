/** Human-readable dynasty label from ruler record fields */
export function formatDynastyLabel(ruler) {
  const raw = ruler?.dynasty || ruler?.dynasty_name || ruler?.dynasty_id;
  if (!raw) return "";
  return String(raw)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function rulerLinkLabel(ruler) {
  const dynasty = formatDynastyLabel(ruler);
  return dynasty ? `${ruler.name} (${dynasty})` : ruler.name;
}
