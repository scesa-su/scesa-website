import type { Leader } from "@/domain/entities/Leader";
import type { Partner } from "@/domain/entities/Partner";
import type { IAboutRepository } from "@/domain/repositories/IAboutRepository";
import { sortLeaders } from "@/domain/usecases/leaderQueries";
import { JsonAboutDataSource } from "@/data/datasources/JsonAboutDataSource";

export class AboutRepository implements IAboutRepository {
  private readonly source: JsonAboutDataSource;

  constructor(source: JsonAboutDataSource) {
    this.source = source;
  }

  async getLeaders(): Promise<Leader[]> {
    return sortLeaders(await this.source.readLeaders());
  }

  getPartners(): Promise<Partner[]> {
    return this.source.readPartners();
  }
}

export const aboutRepository = new AboutRepository(new JsonAboutDataSource());
