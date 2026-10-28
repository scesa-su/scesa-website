/** Board roles in display order; any other role is listed after these, alphabetically. */
export const LEADER_ROLE_ORDER = [
  "President",
  "Vice President",
  "Secretary",
  "Finance Executive",
  "Project Manager",
  "Membership Coordinator",
  "Director of Communications",
] as const;

export type Leader = {
  name: string;
  role: string;
  /** Path under /images/, a transparent cut-out portrait */
  photo: string;
};
