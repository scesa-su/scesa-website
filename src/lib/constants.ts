export const SITE_URL = "https://scesa.co.ke";
export const CONTACT_EMAIL = "scesa@strathmore.edu";

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
  { label: "Email", href: `mailto:${CONTACT_EMAIL}`, icon: "email" },
  { label: "Luma", href: "https://luma.com/user/SCESA", icon: "luma" },
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];

type HeroPhoto = { src: string; width: number; height: number; alt: string; caption: string; date?: string };

// width/height are the photo's pixel size; any aspect ratio works. Leave date out when it is not known.
export const HERO_PHOTOS: readonly HeroPhoto[] = [
  {
    src: "/images/home/clubs-sports-gala-2026.jpg",
    width: 800,
    height: 1066,
    alt: "Two SCESA leaders holding the club's four award plaques at the Strathmore Clubs & Sports Gala",
    caption: "Clubs & Sports Gala",
    date: "Jun 2026",
  },
  {
    src: "/images/home/em-industry-visit.jpg",
    width: 800,
    height: 533,
    alt: "SCESA members posing as a group in front of an E&M Technology House backdrop",
    caption: "E&M Technology House visit",
    date: "Jun 2026",
  },
  {
    src: "/images/home/team-building-hike-2025.jpg",
    width: 800,
    height: 533,
    alt: "SCESA members smiling as they walk a forest trail on the team building hike",
    caption: "Team building hike",
    date: "Jun 2025",
  },
  {
    src: "/images/home/arduino-workshop.jpg",
    width: 800,
    height: 600,
    alt: "Students at the SCESA Arduino workshop standing together outside a campus building",
    caption: "Arduino workshop",
    date: "Sep 2025",
  },
  {
    src: "/images/about/members-auditorium.jpeg",
    width: 1120,
    height: 840,
    alt: "Students seated in a Strathmore University auditorium during a Data Engineering event",
    caption: "Data Engineering event",
    date: "2025",
  },
];

export const HOME_STATS = [
  { value: "250+", label: "members over the years" },
  { value: "6", label: "dedicated communities" },
  { value: "4", label: "Clubs & Sports Gala 2025 awards" },
] as const;

export const COMMUNITIES = [
  "ESA Strathmore",
  "Strathmore Data Community",
  "AWS Rebuild",
  "Google Developer Group",
  "IET",
  "Women in Tech Kenya",
  "SU Cybersecurity Club",
] as const;

// One-time membership fee, paid to the same Paybill account as Team Building (owner decision 2026-10-31).
export const MEMBERSHIP_FEE_KES = 500;
export const MPESA_PAYBILL = "4098097";
export const MPESA_ACCOUNT = "0242402209001";

// The old Google Form, linked when JavaScript is off. It stays open this term (owner decision 2026-10-31).
export const MEMBERSHIP_GOOGLE_FORM_URL = "https://forms.gle/CStqGdz7xmTy48n77";
