import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../config/api.js";

/**
 * Generic data-fetching hook for all RajasthanConnect API calls.
 * Supports loading, error, refetch, and optional page-based infinite scroll.
 *
 * @param {string} endpoint - e.g. "/api/festivals"
 * @param {object} [params]  - query params object { key: value }
 * @param {object} [options] - { immediate: bool, pageSize: number }
 */
export function useFetch(endpoint, params = {}, options = {}) {
  const { immediate = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Stable ref so the effect doesn't re-run on every render if params object changes identity
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(
        Object.entries(paramsRef.current).filter(
          ([, v]) => v !== null && v !== undefined && v !== ""
        )
      ).toString();
      const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ""}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `API error ${res.status}`);
      }
      if (!Array.isArray(json)) {
        throw new Error(json.error || "Invalid API response");
      }
      setData(json);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (immediate) fetchData();
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Convenience hook for a single item by ID.
 * @param {string} endpoint - e.g. "/api/festivals"
 * @param {string|number} id
 */
export function useFetchById(endpoint, id) {
  return useFetch(id ? `${endpoint}/${id}` : null, {}, { immediate: !!id });
}
