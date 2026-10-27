import type { Event } from "../entities/Event";

export interface IEventRepository {
  /** All events, newest first by start date. */
  getAll(): Promise<Event[]>;
  getBySlug(slug: string): Promise<Event | undefined>;
}
