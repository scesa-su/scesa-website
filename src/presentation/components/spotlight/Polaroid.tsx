import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PolaroidProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Handwritten caption on the frame below the photo. */
  caption?: ReactNode;
  /** Image box shape, e.g. "aspect-4/3". */
  aspect?: string;
  priority?: boolean;
  /** Alternates the tilt so a column of polaroids looks hand-placed. */
  index?: number;
  className?: string;
};

/** A photo in a white instant-film frame, matching the home deck. White in both themes. */
export function Polaroid({ src, alt, sizes, caption, aspect = "aspect-4/3", priority, index = 0, className }: PolaroidProps) {
  return (
    <figure
      className={cn(
        "bg-white p-2 shadow-md ring-1 ring-slate-900/5",
        caption ? "pb-0" : "pb-2",
        index % 2 ? "rotate-1" : "-rotate-1",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", aspect)}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      {caption && <figcaption className="px-1 pt-1.5 pb-2.5">{caption}</figcaption>}
    </figure>
  );
}
