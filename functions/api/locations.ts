import { jsonResponse, normalizeText, type PagesHandler } from "../_shared";

interface GeoNameResult {
  name?: string;
  adminName1?: string;
  countryName?: string;
  countryCode?: string;
}

export const onRequestGet: PagesHandler = async ({ request, env }) => {
  const username = env.GEONAMES_USERNAME;
  const url = new URL(request.url);
  const query = normalizeText(url.searchParams.get("q"), 80);

  if (!query || query.length < 2) {
    return jsonResponse({ success: true, configured: Boolean(username), locations: [] });
  }

  if (!username) {
    return jsonResponse({ success: true, configured: false, locations: [] });
  }

  const geoNamesUrl = new URL("https://secure.geonames.org/searchJSON");
  geoNamesUrl.searchParams.set("name_startsWith", query);
  geoNamesUrl.searchParams.set("maxRows", "8");
  geoNamesUrl.searchParams.set("orderby", "relevance");
  geoNamesUrl.searchParams.set("cities", "cities1000");
  geoNamesUrl.searchParams.set("style", "MEDIUM");
  geoNamesUrl.searchParams.set("username", username);

  try {
    const response = await fetch(geoNamesUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return jsonResponse({ success: true, configured: true, locations: [] });
    }

    const payload = await response.json();
    const locations = Array.isArray(payload.geonames)
      ? payload.geonames
          .map((place: GeoNameResult) => {
            const parts = [
              place.name,
              place.adminName1,
              place.countryName || place.countryCode,
            ].filter(Boolean);

            return [...new Set(parts)].join(", ");
          })
          .filter(Boolean)
      : [];

    return jsonResponse({
      success: true,
      configured: true,
      locations: [...new Set(locations)].slice(0, 8),
    });
  } catch (error) {
    console.error("[Locations API]", error instanceof Error ? error.message : error);
    return jsonResponse({ success: true, configured: true, locations: [] });
  }
};
