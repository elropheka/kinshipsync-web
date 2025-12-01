/**
 * Generates the full URL for an event website based on the custom URL slug
 * @param customUrlSlug The custom URL slug for the event website
 * @returns The complete URL for the event website
 */
export const getEventWebsiteUrl = (customUrlSlug: string): string => {
  // Base URL from environment variable or default to localhost for development
  //const baseUrl = import.meta.env.VITE_EVENT_WEBSITE_BASE_URL || 'http'; //localhost:3000 for development
  return `/events/site/${customUrlSlug}`;
};
