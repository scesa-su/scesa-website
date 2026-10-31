import "server-only";
import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_URL = "https://sheets.googleapis.com/v4/spreadsheets";

export type SheetsConfig = { clientEmail: string; privateKey: string; sheetId: string };

/** Sheets could not be reached or refused the request. Callers answer 503. */
export class SheetsUnavailableError extends Error {}

/** undefined when any of the env vars is missing, which closes registration. */
export function readSheetsConfig(env: NodeJS.ProcessEnv = process.env): SheetsConfig | undefined {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL: clientEmail, GOOGLE_PRIVATE_KEY: key, MEMBERS_SHEET_ID: sheetId } = env;
  if (!clientEmail || !key || !sheetId) return undefined;
  // Vercel stores the key's newlines as literal \n.
  return { clientEmail, privateKey: key.replace(/\\n/g, "\n"), sheetId };
}

type Cell = string | number | boolean;

/** Sheets v4 over plain fetch, authorised with a service-account JWT (RS256, node:crypto). */
export class GoogleSheetsDataSource {
  private readonly config: SheetsConfig;
  private token?: { value: string; expiresAt: number };

  constructor(config: SheetsConfig) {
    this.config = config;
  }

  /** The given columns of a tab, from row 2 down, as strings. Ranges like "Members!A2:A". */
  async readColumns(ranges: string[]): Promise<string[][]> {
    const query = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&");
    const body = (await this.request(`${SHEETS_URL}/${this.config.sheetId}/values:batchGet?${query}`)) as {
      valueRanges?: { values?: Cell[][] }[];
    };
    return (body.valueRanges ?? []).map((vr) => (vr.values ?? []).map((row) => String(row[0] ?? "")));
  }

  /** Appends one row below the last row of the tab. RAW keeps student IDs and phones as text. */
  async appendRow(tab: string, row: Cell[]): Promise<void> {
    const range = encodeURIComponent(`${tab}!A1`);
    await this.request(
      `${SHEETS_URL}/${this.config.sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { method: "POST", body: JSON.stringify({ values: [row] }) },
    );
  }

  private async request(url: string, init: RequestInit = {}): Promise<unknown> {
    const token = await this.accessToken();
    let res: Response;
    try {
      res = await fetch(url, {
        ...init,
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        cache: "no-store",
      });
    } catch {
      throw new SheetsUnavailableError("Sheets request failed");
    }
    if (!res.ok) throw new SheetsUnavailableError(`Sheets responded ${res.status}`);
    return res.json();
  }

  private async accessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.token && this.token.expiresAt - 60 > now) return this.token.value;

    const encode = (v: object) => Buffer.from(JSON.stringify(v)).toString("base64url");
    const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
      iss: this.config.clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })}`;
    let signature: string;
    try {
      signature = createSign("RSA-SHA256").update(unsigned).sign(this.config.privateKey, "base64url");
    } catch {
      throw new SheetsUnavailableError("GOOGLE_PRIVATE_KEY could not sign");
    }

    let res: Response;
    try {
      res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: `${unsigned}.${signature}`,
        }),
        cache: "no-store",
      });
    } catch {
      throw new SheetsUnavailableError("Token request failed");
    }
    if (!res.ok) throw new SheetsUnavailableError(`Token endpoint responded ${res.status}`);
    const { access_token, expires_in } = (await res.json()) as { access_token: string; expires_in: number };
    this.token = { value: access_token, expiresAt: now + expires_in };
    return access_token;
  }
}
