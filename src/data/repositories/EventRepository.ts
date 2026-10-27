import type { Event } from "@/domain/entities/Event";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import { sortNewestFirst } from "@/domain/usecases/eventQueries";
import { MdxEventsDataSource } from "@/data/datasources/MdxEventsDataSource";

export class EventRepository implements IEventRepository {
  private readonly source: MdxEventsDataSource;

  constructor(source: MdxEventsDataSource) {
    this.source = source;
  }

  async getAll(): Promise<Event[]> {
    return sortNewestFirst(await this.source.readAll());
  }

  async getBySlug(slug: string): Promise<Event | undefined> {
    return (await this.getAll()).find((e) => e.slug === slug);
  }
}

export const eventRepository = new EventRepository(new MdxEventsDataSource());
