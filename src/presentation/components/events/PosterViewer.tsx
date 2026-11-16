"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "@/lib/styles";

const ICON_BUTTON = cn(
  "flex size-11 items-center justify-center rounded-full shadow-lg transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 active:duration-100 motion-reduce:transform-none",
  FOCUS_RING,
);

/** Expand button for the bottom-right of the poster; opens the whole, uncropped poster in a modal dialog. */
export function PosterViewer({ src, alt, title }: { src: string; alt: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);

  function open() {
    const root = document.documentElement;
    root.style.setProperty("--scrollbar-gap", `${window.innerWidth - root.clientWidth}px`);
    dialog.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`View the full poster for ${title}`}
        className={cn("absolute right-3 bottom-3 bg-slate-900/70 text-white backdrop-blur-sm hover:bg-slate-900/90", ICON_BUTTON)}
      >
        <Maximize2 aria-hidden="true" className="size-5" />
      </button>
      {/* Native dialog: Esc closes it and focus returns to the expand button. A click outside the poster closes it too. */}
      <dialog
        ref={dialog}
        aria-label={`Poster for ${title}`}
        data-lenis-prevent
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="poster-dialog m-auto max-h-none max-w-none overflow-visible bg-transparent p-4"
      >
        <figure className="relative">
          <Image
            src={src}
            alt={alt}
            width={1080}
            height={1350}
            sizes="(min-width: 768px) 70vh, 92vw"
            className="h-auto max-h-[82dvh] w-auto max-w-[min(92vw,60rem)] rounded-2xl shadow-2xl"
          />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close poster"
            className={cn("absolute top-3 right-3 bg-white text-slate-900 hover:bg-slate-100", ICON_BUTTON)}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white/80">
            <span className="font-medium text-white">{title}</span>
            <span className="hidden sm:inline">Press Esc to close</span>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}
