import type { Leader } from "@/domain/entities/Leader";
import { PolaroidBoard } from "./PolaroidBoard";
import { BODY, CONTAINER, H2 } from "./styles";

export function BoardWall({ leaders }: { leaders: Leader[] }) {
  return (
    <section aria-labelledby="board" className="bg-navy-25 py-16 lg:py-24">
      <div className={CONTAINER}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="board" className={H2}>
            Meet the board
          </h2>
          <p className={`mt-4 ${BODY}`}>The seven students running SCESA for 2026/27.</p>
        </div>
        <PolaroidBoard leaders={leaders} />
      </div>
    </section>
  );
}
