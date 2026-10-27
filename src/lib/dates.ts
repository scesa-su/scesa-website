const TZ = "Africa/Nairobi";
const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...options });

const longDate = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDate = fmt({ day: "numeric", month: "short", year: "numeric" });
const time = fmt({ hour: "numeric", minute: "2-digit", hour12: true });
const monthAbbr = fmt({ month: "short" });
const dayOfMonth = fmt({ day: "numeric" });

/** "Saturday 14 November 2026" in Nairobi time. */
export const formatLongDate = (iso: string) => longDate.format(new Date(iso));
/** "14 Nov 2026" in Nairobi time. */
export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
export const formatMonthAbbr = (iso: string) => monthAbbr.format(new Date(iso));
export const formatDayOfMonth = (iso: string) => dayOfMonth.format(new Date(iso));

/** "9:00 am – 5:00 pm EAT", prefixing the end with its date when it falls on another day. */
export function formatTimeRange(startIso: string, endIso: string) {
  const end = new Date(endIso);
  const sameDay = shortDate.format(new Date(startIso)) === shortDate.format(end);
  const endText = sameDay ? time.format(end) : `${shortDate.format(end)}, ${time.format(end)}`;
  return `${time.format(new Date(startIso))} – ${endText} EAT`;
}
