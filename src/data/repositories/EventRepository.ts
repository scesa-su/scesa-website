import type { Event } from "../../domain/entities/Event.ts";
import type { IEventRepository } from "../../domain/repositories/IEventRepository.ts";
import { eventStatus, sortNewestFirst } from "../../domain/usecases/eventQueries.ts";
import { MdxEventsDataSource } from "../datasources/MdxEventsDataSource.ts";

export class EventRepository implements IEventRepository {
  private readonly source: MdxEventsDataSource;

  constructor(source: MdxEventsDataSource) {
    this.source = source;
  }

  async getAll(): Promise<Event[]> {
    const now = new Date();
    const events = (await this.source.readAll()).map((e) => ({ ...e, status: eventStatus(e.date, e.endDate, now) }));
    return sortNewestFirst(events);
  }

  async getBySlug(slug: string): Promise<Event | undefined> {
    return (await this.getAll()).find((e) => e.slug === slug);
  }
}

export const eventRepository = new EventRepository(new MdxEventsDataSource());
