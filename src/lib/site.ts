/**
 * Absolute base URL of the deployed site. Used as `metadataBase` so Open Graph
 * and canonical URLs resolve to absolute links. Prefers an explicit env var,
 * falls back to Vercel's provided URL, then localhost for dev.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
