import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Sparkles, MessageSquare, Lightbulb, Dumbbell, TrendingUp, History, Wind, Wand2 } from "lucide-react";

export const Route = createFileRoute("/ai/")({
  head: () => ({ meta: [{ title: "IA — Fala que eu te escuto" }] }),
  component: AIPage,
});

const actions = [
  { to: "/ai/chat", label: "Treinar apresentação", icon: Wand2 },
  { to: "/ai/chat", label: "Gerar discurso", icon: MessageSquare },
  { to: "/ai/chat", label: "Responder perguntas", icon: Sparkles },
  { to: "/ai/exercises", label: "Controlar ansiedade", icon: Wind },
  { to: "/ai/exercises", label: "Exercícios", icon: Dumbbell },
  { to: "/ai/suggestions", label: "Sugestões", icon: Lightbulb },
  { to: "/ai/insights", label: "Insights", icon: TrendingUp },
  { to: "/ai/history", label: "Histórico", icon: History },
];

function AIPage() {
  return (
    <AppShell>
      <PageHeader title="IA" subtitle="Seu mentor de oratória" />
      <div className="px-5">
        <Card className="flex flex-col items-center rounded-3xl border-0 bg-gradient-brand p-6 text-center text-white shadow-lift">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Sparkles className="h-9 w-9" />
            </div>
            <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-white/10" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Como posso ajudar você hoje?</h2>
          <p className="mt-1 text-sm opacity-90">Escolha uma ação ou converse comigo.</p>
          <Link
            to="/ai/chat"
            className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow"
          >
            Conversar com a IA
          </Link>
        </Card>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 transition hover:shadow-soft hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
                <a.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
