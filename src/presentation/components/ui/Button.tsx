import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING_OFFSET } from "@/lib/styles";

const variants = {
  // Design colour; white on #FF7A3F is ~2.6:1, below WCAG AA (owner decision 2026-10-27).
  primary: "bg-brand-accent text-white shadow-sm shadow-brand-accent/20 before:bg-orange-600 hover:shadow-lg hover:shadow-brand-accent/30",
  soft: "bg-orange-50 text-brand-accent before:bg-orange-100",
  outline:
    "border border-brand-border bg-transparent text-brand-primary before:bg-brand-sunken hover:border-brand-primary",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-md",
  xl: "h-14 px-7 text-lg",
} as const;

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps>;
type NativeButtonProps = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

export type ButtonProps = LinkProps | NativeButtonProps;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg font-body font-medium",
    "transition-[border-color,color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-out-expo hover:before:scale-x-100 focus-visible:before:scale-x-100",
    "active:scale-[0.96] active:duration-100 active:ease-out motion-reduce:transform-none",
    FOCUS_RING_OFFSET,
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (props.href !== undefined) {
    return <Link {...(props as LinkProps)} className={classes} />;
  }
  return (
    <button type="button" {...(props as NativeButtonProps)} className={classes} />
  );
}
