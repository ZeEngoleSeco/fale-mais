import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BrandLogo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-background p-0.5 shadow-soft ring-1 ring-cyan-500/30 transition-transform hover:scale-105",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src="/app-icon.png"
        alt="Fale+ Ícone Oficial"
        className="h-full w-full object-cover rounded-xl filter drop-shadow-md transition-all"
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
