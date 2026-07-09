import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Sparkles, Calendar, Dumbbell, User, Bell, Flame, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BrandLogo } from "@/components/brand";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Início — Fala que eu te escuto+" },
      { name: "description", content: "Seu painel diário para praticar oratória com IA, salas e eventos." },
    ],
  }),
  component: HomePage,
});

const shortcuts = [
  { to: "/rooms", label: "Salas de prática", desc: "Pratique com pessoas reais", icon: Users, color: "from-blue-500 to-blue-600" },
  { to: "/ai", label: "IA", desc: "Treine com seu mentor virtual", icon: Sparkles, color: "from-violet-500 to-fuchsia-500" },
  { to: "/events", label: "Eventos", desc: "Online e presenciais", icon: Calendar, color: "from-sky-500 to-cyan-500" },
  { to: "/ai/exercises", label: "Exercícios", desc: "Improviso, pitch e respiração", icon: Dumbbell, color: "from-emerald-500 to-teal-500" },
  { to: "/profile", label: "Perfil", desc: "Progresso e nível", icon: User, color: "from-indigo-500 to-purple-600" },
] as const;

function HomePage() {
  return (
    <AppShell>
      <header className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={40} />
            <div>
              <p className="text-xs text-muted-foreground">Olá,</p>
              <p className="text-base font-semibold">Bem-vindo ao Fala que eu te escuto+</p>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
            <Bell className="h-4 w-4" />
          </button>
        </div>

        <Card className="mt-6 overflow-hidden rounded-3xl border-0 bg-gradient-brand p-5 text-white shadow-lift">
          <div className="flex items-center gap-2 text-xs font-medium opacity-90">
            <Flame className="h-3.5 w-3.5" /> Sequência de 4 dias
          </div>
          <h2 className="mt-2 text-xl font-bold leading-tight">
            Pronto para vencer o palco hoje?
          </h2>
          <p className="mt-1 text-sm opacity-90">
            Comece com 5 minutos de treino guiado pela IA.
          </p>
          <Link
            to="/ai/chat"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-primary shadow"
          >
            Começar treino <TrendingUp className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </header>

      <section className="px-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Atalhos</h3>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-4 transition hover:shadow-soft hover:-translate-y-0.5"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-soft`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <p className="text-[15px] font-semibold">{s.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">Retomar</h3>
          <Link to="/ai/history" className="text-xs font-medium text-primary">Ver tudo</Link>
        </div>
        <Card className="mt-3 flex items-center gap-3 rounded-3xl border-border p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-soft">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Pitch de 60 segundos</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Retomar de onde parou</p>
          </div>
          <Link
            to="/ai/chat"
            className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold"
          >
            Abrir
          </Link>
        </Card>
      </section>
    </AppShell>
  );
}
