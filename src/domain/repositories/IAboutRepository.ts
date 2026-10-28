import type { Leader } from "../entities/Leader";
import type { Partner } from "../entities/Partner";

export interface IAboutRepository {
  /** Board members in fixed role order. */
  getLeaders(): Promise<Leader[]>;
  getPartners(): Promise<Partner[]>;
}
