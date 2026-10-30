const GITHUB_ENV = [
  "NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
] as const;

/** In production the editor needs the GitHub app's slug and all three secrets; without any of them, /keystatic and its API are a 404. */
export const keystaticEnabled = () => process.env.NODE_ENV !== "production" || GITHUB_ENV.every((name) => Boolean(process.env[name]));

export const KEYSTATIC_REPO = "scesa-su/scesa-website";

/** The GitHub access token Keystatic is about to store, read from its login response. */
export function accessTokenFrom(setCookies: string[]): string | undefined {
  const cookie = setCookies.find((c) => c.startsWith("keystatic-gh-access-token="));
  const value = cookie?.split(";")[0].slice("keystatic-gh-access-token=".length);
  return value ? decodeURIComponent(value) : undefined;
}

/** Only accounts that can push to the repo (the editors team and the owner) may sign in. */
export async function canEdit(token: string, fetcher: typeof fetch = fetch): Promise<boolean> {
  try {
    const res = await fetcher(`https://api.github.com/repos/${KEYSTATIC_REPO}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const repo = (await res.json()) as { permissions?: { push?: boolean } };
    return repo.permissions?.push === true;
  } catch {
    return false;
  }
}
