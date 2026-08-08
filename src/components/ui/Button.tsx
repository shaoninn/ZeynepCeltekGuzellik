"use client";

import { cn } from "@/lib/utils";
import { SiteLink } from "@/components/ui/SiteLink";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wider transition-all duration-200",
    {
      "btn-primary": variant === "primary",
      "btn-outline": variant === "outline",
      "bg-transparent text-white hover:text-orange border-none": variant === "ghost",
      "text-xs px-3 py-2": size === "sm",
      "text-sm px-6 py-3": size === "md",
      "text-base px-8 py-4": size === "lg",
    },
    className
  );

  if (href) {
    return (
      <SiteLink href={href} className={baseClasses}>
        {children}
      </SiteLink>
    );
  }

  return (
    <button type="button" className={baseClasses} {...props}>
      {children}
    </button>
  );
}
