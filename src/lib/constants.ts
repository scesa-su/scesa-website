export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Communities", href: "/communities" },
  { label: "Spotlight", href: "/spotlight" },
  { label: "About", href: "/about" },
] as const;

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/strathmore-computing-and-engineering-student-s-association/", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/strathmore.scesa/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@scesacommunity", icon: "tiktok" },
  { label: "Email", href: "mailto:scesa@strathmore.edu", icon: "email" },
  { label: "Luma", href: "https://luma.com/user/SCESA", icon: "luma" },
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];

// shortcut: placeholder SVGs until real SCESA event photos are added to public/images/home.
export const HERO_PHOTOS = [
  { src: "/images/home/deck-1.svg", alt: "SCESA members holding Clubs & Sports Gala awards" },
  { src: "/images/home/deck-2.svg", alt: "Students at a SCESA hackathon" },
  { src: "/images/home/deck-3.svg", alt: "A SCESA workshop in session" },
  { src: "/images/home/deck-4.svg", alt: "SCESA community meetup" },
  { src: "/images/home/deck-5.svg", alt: "SCESA members at a tech talk" },
] as const;

export const HOME_STATS = [
  { value: "500+", label: "student members" },
  { value: "6", label: "dedicated communities" },
  { value: "4", label: "Clubs & Sports Gala 2025 awards" },
] as const;

const EXCERPT = "A practical talk on component APIs, accessibility, and shipping faster in Angular.";
const EVENT_IMAGE = "/images/home/event.svg";
const EVENT_IMAGE_ALT = "Angular Kenya Campus Roadshow poster";

export const FEATURED_EVENTS = [
  { title: "Angular Kenya workshop", status: "live", excerpt: EXCERPT, image: EVENT_IMAGE, imageAlt: EVENT_IMAGE_ALT },
  { title: "Angular Kenya roadshow", status: "scheduled", excerpt: EXCERPT, image: EVENT_IMAGE, imageAlt: EVENT_IMAGE_ALT },
  { title: "Angular Kenya meetup", status: "completed", excerpt: EXCERPT, image: EVENT_IMAGE, imageAlt: EVENT_IMAGE_ALT },
] as const;
