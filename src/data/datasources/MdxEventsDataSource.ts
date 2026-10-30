import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseEventFile, type StoredEvent } from "../models/eventSchema.ts";

const EVENTS_DIR = "src/content/events";

export class MdxEventsDataSource {
  async readAll(): Promise<StoredEvent[]> {
    // Keystatic deletes the folder along with the last event; no folder means no events.
    const names = await readdir(path.join(process.cwd(), EVENTS_DIR)).catch((e: NodeJS.ErrnoException) => {
      if (e.code === "ENOENT") return [];
      throw e;
    });
    const files = names.filter((f) => f.endsWith(".mdx"));
    return Promise.all(
      files.map(async (f) => {
        const file = path.join(EVENTS_DIR, f);
        return parseEventFile(file, await readFile(path.join(process.cwd(), file), "utf8"));
      }),
    );
  }
}
