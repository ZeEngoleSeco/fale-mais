import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BrandLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-purple-500/10 p-0.5 shadow-soft ring-1 ring-purple-500/20 transition-transform hover:scale-105",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src="/app-icon.png"
        alt="Fale+ Mascote"
        className="h-full w-full object-contain filter drop-shadow-sm"
      />
    </div>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-xl font-extrabold tracking-tight", className)}>
      <span className="text-foreground">Fale</span>
      <span className="text-gradient-brand">+</span>
    </span>
  );
}

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-gradient-brand font-extrabold", className)}>{children}</span>;
}
