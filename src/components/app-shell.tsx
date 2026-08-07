import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, Sparkles, Calendar, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo, BrandWordmark } from "@/components/brand";

const tabs = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/rooms", label: "Salas", icon: Users },
  { to: "/ai", label: "IA", icon: Sparkles },
  { to: "/events", label: "Eventos", icon: Calendar },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function AppShell({
  children,
  hideNav = false,
  className,
}: {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) =>
    pathname === to || (to !== "/home" && pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background lg:flex">
      {!hideNav && (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 px-4 py-6 lg:flex">
          <Link to="/home" className="mb-8 flex items-center gap-3 px-2">
            <BrandLogo size={36} />
            <BrandWordmark />
          </Link>
          <nav aria-label="Navegação principal">
            <ul className="space-y-1">
              {tabs.map((t) => {
                const active = isActive(t.to);
                const Icon = t.icon;
                return (
                  <li key={t.to}>
                    <Link
                      to={t.to}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all",
                        active
                          ? "bg-gradient-brand text-white shadow-soft"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.25} />
                      <span className="truncate">{t.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      )}
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background lg:mx-0 lg:max-w-none lg:flex-1">
        <main className={cn("flex-1 pb-28 lg:pb-10", className)}>{children}</main>


        {!hideNav && (
          <nav
            aria-label="Navegação principal"
            className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden"
          >
            <div className="rounded-3xl border border-border/60 bg-card/90 px-2 py-2 shadow-lift backdrop-blur-xl">
              <ul className="flex items-center justify-between">
                {tabs.map((t) => {
                  const active = isActive(t.to);
                  const Icon = t.icon;

                  return (
                    <li key={t.to} className="flex-1">
                      <Link
                        to={t.to}
                        className={cn(
                          "group relative mx-auto flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[11px] font-medium transition-all",
                          active
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                            active
                              ? "bg-gradient-brand text-white shadow-soft scale-105"
                              : "bg-transparent",
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                        </span>
                        <span>{t.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  back?: string;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/85 px-5 pt-6 pb-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {back && (
          <Link
            to={back}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition hover:bg-secondary"
            aria-label="Voltar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
