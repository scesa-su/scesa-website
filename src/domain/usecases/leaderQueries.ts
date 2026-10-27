import { LEADER_ROLE_ORDER, type Leader } from "../entities/Leader.ts";

const rank = (role: string) => {
  const i = (LEADER_ROLE_ORDER as readonly string[]).indexOf(role);
  return i === -1 ? LEADER_ROLE_ORDER.length : i;
};

/** Fixed roles first in LEADER_ROLE_ORDER, then unknown roles alphabetically (then by name). */
export function sortLeaders(leaders: readonly Leader[]): Leader[] {
  return [...leaders].sort(
    (a, b) => rank(a.role) - rank(b.role) || a.role.localeCompare(b.role) || a.name.localeCompare(b.name),
  );
}
