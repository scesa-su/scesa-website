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
