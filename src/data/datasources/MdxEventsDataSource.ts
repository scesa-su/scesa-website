import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Event } from "@/domain/entities/Event";
import { parseEventFile } from "@/data/models/eventSchema";

const EVENTS_DIR = path.join(process.cwd(), "src/content/events");

export class MdxEventsDataSource {
  async readAll(): Promise<Event[]> {
    const files = (await readdir(EVENTS_DIR)).filter((f) => f.endsWith(".mdx"));
    return Promise.all(
      files.map(async (f) => parseEventFile(f, await readFile(path.join(EVENTS_DIR, f), "utf8"))),
    );
  }
}
