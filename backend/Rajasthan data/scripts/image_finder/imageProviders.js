import { searchPexels } from "./pexelsClient.js";
import { sleep } from "./rateLimit.js";

/**
 * Find a Pexels image for a prompt result.
 * Falls back to appending "Rajasthan India" if no results found.
 */
export async function findImage(promptResult, config) {
  const query = promptResult.pexels_query;
  const delay = config.rateLimit?.searchDelayMs ?? 800;

  let result = await searchPexels(query, config);
  await sleep(delay);

  if (!result && !query.toLowerCase().includes("rajasthan")) {
    result = await searchPexels(`${query} Rajasthan India`, config);
  }

  return result;
}
