import type { Event } from "../domain/entities/Event.ts";

type IcsEvent = Pick<Event, "slug" | "title" | "excerpt" | "date" | "endDate" | "venue" | "virtualUrl">;

/** RFC 5545 §3.3.11 TEXT escaping. */
export function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** 2026-11-14T09:00:00+03:00 -> 20261114T060000Z */
const toUtc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Folds lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let octets = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (octets + size > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = "";
      octets = 0;
    }
    current += char;
    octets += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** Builds a single-event iCalendar file. `url` is the event's public page. */
export function buildIcs(event: IcsEvent, url: string) {
  const description = [event.excerpt, event.virtualUrl && `Join online: ${event.virtualUrl}`, url]
    .filter(Boolean)
    .join("\n\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SCESA//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@scesa.com`,
    // Deterministic stamp so the static file is reproducible across builds.
    `DTSTAMP:${toUtc(event.date)}`,
    `DTSTART:${toUtc(event.date)}`,
    `DTEND:${toUtc(event.endDate)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(event.venue ?? event.virtualUrl ?? "")}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
