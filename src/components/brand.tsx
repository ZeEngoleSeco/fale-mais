import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BrandLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none">
        <path
          d="M4 6a3 3 0 0 1 3-3h7a6 6 0 0 1 0 12h-4l-4 4v-4H7a3 3 0 0 1-3-3V6Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path d="M17 13v6M14 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-xl font-extrabold tracking-tight", className)}>
      <span className="text-foreground">Fala</span>
      <span className="text-gradient-brand"> que eu te escuto</span>
    </span>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-gradient-brand font-extrabold", className)}>{children}</span>;
}
