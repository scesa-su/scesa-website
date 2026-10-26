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

// shortcut: placeholder SVGs and captions until real SCESA event photos are added to public/images/home.
// width/height are the photo's pixel size; any aspect ratio works.
export const HERO_PHOTOS = [
  { src: "/images/home/deck-1.svg", width: 800, height: 1000, alt: "Placeholder for SCESA event photo 1", caption: "Clubs & Sports Gala", date: "Apr 2025" },
  { src: "/images/home/deck-2.svg", width: 1000, height: 800, alt: "Placeholder for SCESA event photo 2", caption: "Angular Kenya roadshow", date: "Feb 2025" },
  { src: "/images/home/deck-3.svg", width: 900, height: 900, alt: "Placeholder for SCESA event photo 3", caption: "Hackathon weekend", date: "Nov 2024" },
  { src: "/images/home/deck-4.svg", width: 750, height: 1000, alt: "Placeholder for SCESA event photo 4", caption: "AI & ML Circle meetup", date: "Mar 2025" },
  { src: "/images/home/deck-5.svg", width: 1050, height: 700, alt: "Placeholder for SCESA event photo 5", caption: "Freshers' welcome", date: "Sep 2024" },
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
