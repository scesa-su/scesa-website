import type { SpotlightImage } from "@/domain/entities/SpotlightPost";
import { Polaroid } from "./Polaroid";

export function Gallery({ images }: { images?: SpotlightImage[] }) {
  if (!images?.length) return null;
  return (
    <section aria-labelledby="gallery" className="mt-12">
      <h2 id="gallery" className="font-display text-display-xs font-semibold text-brand-primary">
        Photos
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={`${i}-${img.image}`}>
            <Polaroid src={img.image} alt={img.alt} index={i} sizes="(min-width: 640px) 220px, 45vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
