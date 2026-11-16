import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "@/lib/styles";

type LogoProps = {
  // "adaptive": colour logo in light mode, white logo in dark mode. "light": always white (navy backgrounds).
  tone?: "adaptive" | "light";
  className?: string;
};

export function Logo({ tone = "adaptive", className }: LogoProps) {
  const imageClass =
    "h-8 w-auto transition-[height] duration-500 ease-out-expo lg:h-15 lg:group-data-condensed/nav:h-10";
  return (
    <Link
      href="/"
      aria-label="SCESA home"
      className={cn(
        `inline-flex shrink-0 rounded-lg ${FOCUS_RING}`,
        className,
      )}
    >
      {tone === "adaptive" && (
        <Image
          src="/scesa-logo.svg"
          alt=""
          width={143}
          height={60}
          priority
          unoptimized
          className={cn(imageClass, "dark:hidden")}
        />
      )}
      <Image
        src="/scesa-logo-white.svg"
        alt=""
        width={143}
        height={60}
        unoptimized
        className={cn(imageClass, tone === "adaptive" && "hidden dark:block")}
      />
    </Link>
  );
}
