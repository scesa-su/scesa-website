const GITHUB_ENV = [
  "NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
] as const;

/** In production the editor needs the GitHub app's slug and all three secrets; without any of them, /keystatic and its API are a 404. */
export const keystaticEnabled = () => process.env.NODE_ENV !== "production" || GITHUB_ENV.every((name) => Boolean(process.env[name]));
