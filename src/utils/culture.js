/** Stable unique key for culture topics (folk arts + handicrafts can share the same id). */
export function cultureTopicKey(topic) {
  if (!topic) return "";
  const type = topic.sourceType || topic.category || "culture";
  return `${type}-${topic.id}`;
}

/** Best detail route for a culture topic from the combined /api/culture payload. */
export function cultureTopicLink(topic) {
  if (!topic?.id) return "/history-culture";
  switch (topic.sourceType) {
    case "folk-art":
      return `/folk-arts/${topic.id}`;
    case "handicraft":
      return `/handicrafts/${topic.id}`;
    case "attire":
      return `/attire/${topic.id}`;
    default:
      return `/culture/${topic.id}`;
  }
}
