import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { SPOTLIGHT_KINDS, type SpotlightPost } from "../../domain/entities/SpotlightPost.ts";
import { parseSpotlightFile } from "../models/spotlightSchema.ts";

const SPOTLIGHT_DIR = "src/content/spotlight";

/** Reads one folder per kind (`src/content/spotlight/<kind>/<slug>.mdx`), as Keystatic writes them. */
export class MdxSpotlightDataSource {
  private readonly dir: string;

  constructor(dir = SPOTLIGHT_DIR) {
    this.dir = dir;
  }

  async readAll(): Promise<SpotlightPost[]> {
    // A post must sit in a kind folder; one left at the root would otherwise be silently dropped.
    const stray = (await readdir(path.resolve(this.dir))).find((f) => f.endsWith(".mdx"));
    if (stray) throw new Error(`${path.join(this.dir, stray)} is not in a kind folder (${SPOTLIGHT_KINDS.join(", ")})`);
    const perKind = await Promise.all(
      SPOTLIGHT_KINDS.map(async (kind) => {
        const folder = path.join(this.dir, kind);
        // Only .mdx is read, so README.md never reaches the build; a kind with no posts may have no folder.
        const names = await readdir(path.resolve(folder)).catch((e: NodeJS.ErrnoException) => {
          if (e.code === "ENOENT") return [];
          throw e;
        });
        const files = names.filter((f) => f.endsWith(".mdx"));
        return Promise.all(
          files.map(async (f) => {
            const file = path.join(folder, f);
            return { file, post: parseSpotlightFile(kind, file, await readFile(path.resolve(file), "utf8")) };
          }),
        );
      }),
    );
    const seen = new Map<string, string>();
    for (const { file, post } of perKind.flat()) {
      const other = seen.get(post.slug);
      if (other) throw new Error(`Duplicate spotlight slug "${post.slug}": ${other} and ${file}`);
      seen.set(post.slug, file);
    }
    return perKind.flat().map(({ post }) => post);
  }
}
