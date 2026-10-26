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

// shortcut: placeholder URLs, replace with the real SCESA accounts before launch.
export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/", icon: "tiktok" },
  { label: "Email", href: "mailto:hello@scesa.com", icon: "email" },
  { label: "Luma", href: "https://lu.ma/", icon: "luma" },
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];
