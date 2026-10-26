import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  // "adaptive": colour logo in light mode, white logo in dark mode. "light": always white (navy backgrounds).
  tone?: "adaptive" | "light";
  className?: string;
};

export function Logo({ tone = "adaptive", className }: LogoProps) {
  const imageClass = "h-8 w-auto lg:h-15";
  return (
    <Link
      href="/"
      aria-label="SCESA home"
      className={cn(
        "inline-flex shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
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
