import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-orange-700 text-white hover:bg-orange-800",
  soft: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  outline:
    "border border-brand-border bg-transparent text-brand-primary hover:bg-navy-25",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-md",
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
    "inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background",
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
