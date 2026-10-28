import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Leader } from "@/domain/entities/Leader";
import type { Partner } from "@/domain/entities/Partner";
import { parseLeadersFile, parsePartnersFile } from "@/data/models/aboutSchema";

const ABOUT_DIR = path.join(process.cwd(), "src/content/about");

// shortcut: partners.json has no logos; add a `logo` only after each organisation agrees to its use.
export class JsonAboutDataSource {
  async readLeaders(): Promise<Leader[]> {
    return parseLeadersFile("leaders.json", await readFile(path.join(ABOUT_DIR, "leaders.json"), "utf8"));
  }

  async readPartners(): Promise<Partner[]> {
    return parsePartnersFile("partners.json", await readFile(path.join(ABOUT_DIR, "partners.json"), "utf8"));
  }
}
