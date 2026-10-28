import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { SpotlightPost } from "../../domain/entities/SpotlightPost.ts";
import { parseSpotlightFile } from "../models/spotlightSchema.ts";

const SPOTLIGHT_DIR = path.join(process.cwd(), "src/content/spotlight");

// shortcut: MDX in git is the CMS for now (edit .mdx files, Vercel rebuilds on push); upgrade to a git-based CMS (Keystatic, Decap or TinaCMS) behind ISpotlightRepository when non-developers need to edit.
export class MdxSpotlightDataSource {
  async readAll(): Promise<SpotlightPost[]> {
    // Only .mdx is read, so README.md in the folder never reaches the build.
    const files = (await readdir(SPOTLIGHT_DIR)).filter((f) => f.endsWith(".mdx"));
    return Promise.all(
      files.map(async (f) => parseSpotlightFile(f, await readFile(path.join(SPOTLIGHT_DIR, f), "utf8"))),
    );
  }
}
