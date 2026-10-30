import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseEventFile, type StoredEvent } from "../models/eventSchema.ts";

const EVENTS_DIR = "src/content/events";

export class MdxEventsDataSource {
  async readAll(): Promise<StoredEvent[]> {
    const files = (await readdir(path.join(process.cwd(), EVENTS_DIR))).filter((f) => f.endsWith(".mdx"));
    return Promise.all(
      files.map(async (f) => {
        const file = path.join(EVENTS_DIR, f);
        return parseEventFile(file, await readFile(path.join(process.cwd(), file), "utf8"));
      }),
    );
  }
}
