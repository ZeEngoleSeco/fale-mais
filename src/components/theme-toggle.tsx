import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { effectiveTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition-all hover:bg-secondary active:scale-95",
        className
      )}
      title={effectiveTheme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label="Alternar tema"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
    </button>
  );
}

export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ] as const;

  return (
    <div className={cn("flex items-center gap-1 rounded-2xl border border-border bg-card/60 p-1.5", className)}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
              active
                ? "bg-gradient-brand text-white shadow-soft"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
