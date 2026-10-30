"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useRef } from "react";

const iconButton =
  "flex size-10 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-sm transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

/** Expand button for the bottom-right of the poster; opens the whole, uncropped poster in a modal dialog. */
export function PosterViewer({ src, alt, title }: { src: string; alt: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`View the full poster for ${title}`}
        className={`absolute right-3 bottom-3 ${iconButton}`}
      >
        <Maximize2 aria-hidden="true" className="size-5" />
      </button>
      {/* Native dialog: Esc closes it and focus returns to the expand button. A click on the backdrop closes it too. */}
      <dialog
        ref={dialog}
        aria-label={`Poster for ${title}`}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-slate-900/85"
      >
        <div className="relative h-[90dvh] w-[92vw]">
          <Image src={src} alt={alt} fill sizes="92vw" className="object-contain" />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close poster"
            className={`absolute top-0 right-0 ${iconButton}`}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
