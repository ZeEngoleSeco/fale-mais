import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  Dumbbell,
  TrendingUp,
  History,
  Wind,
  Wand2,
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  Volume2,
  Brain,
  ShieldAlert,
} from "lucide-react";
import CardSpotlightEffect from "@/components/CardSpotlightEffect";
import { useState } from "react";

export const Route = createFileRoute("/ai/")({
  head: () => ({ meta: [{ title: "Mentor IA — Fale+" }] }),
  component: AIPage,
});

const modes = [
  { id: "pitch", label: "Pitch & Startups", icon: Zap, prompt: "Quero treinar meu pitch de negócios para investidores." },
  { id: "exec", label: "Oratória Executiva", icon: Brain, prompt: "Como conduzir reuniões de diretoria com autoridade?" },
  { id: "improv", label: "Improviso & Dicção", icon: Wand2, prompt: "Me dê um tema surpresa para discursar em 60 segundos." },
  { id: "calm", label: "Combate ao Medo", icon: Wind, prompt: "Preciso de um exercício para desacelerar a ansiedade agora." },
];

const modules = [
  {
    to: "/ai/chat",
    label: "Mentor Virtual Thorel",
    desc: "Treinamento em tempo real por voz e texto com feedback de IA",
    icon: Bot,
    badge: "IA Ativa",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
  },
  {
    to: "/ai/exercises",
    label: "Exercícios Práticos",
    desc: "Aquecimento vocal, dicção, trava-línguas e postura de palco",
    icon: Dumbbell,
    badge: "Popular",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    to: "/ai/suggestions",
    label: "Sugestões Personalizadas",
    desc: "Dicas geradas com base nos seus últimos discursos e métricas",
    icon: Lightbulb,
    badge: "Recomendado",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    to: "/ai/insights",
    label: "Métricas & Insights",
    desc: "Análise da sua confiança, ritmo (PPM) e controle de vícios de fala",
    icon: TrendingUp,
    badge: "Relatório",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    to: "/ai/history",
    label: "Histórico de Treinos",
    desc: "Veja todas as suas apresentações anteriores e notas da IA",
    icon: History,
    badge: "Acervo",
    badgeColor: "bg-secondary text-muted-foreground border-border",
  },
  {
    to: "/ai/exercises",
    label: "Controle de Ansiedade",
    desc: "Respiração 4-7-8 e desaceleração do ritmo cardíaco antes de falar",
    icon: Wind,
    badge: "Bem-estar",
    badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  },
];

function AIPage() {
  const [selectedMode, setSelectedMode] = useState("pitch");

  return (
    <AppShell>
      <PageHeader title="Mentor IA Thorel" subtitle="Sua inteligência pessoal de oratória e comunicação" />

      <div className="px-5 space-y-4 pb-12">
        {/* Banner Principal do Mentor Futurista */}
        <div className="relative">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-40 blur-md" />

          <Card className="flex flex-col items-center rounded-3xl border-0 bg-gradient-brand p-6 text-center text-white relative overflow-hidden shadow-lift">
            {/* Status Pill Top */}
            <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Thorel AI v3.5 · Ativo & Pronto</span>
            </div>

            {/* Avatar Central com Equalizador de Áudio Animado */}
            <div className="mt-4 relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur ring-4 ring-white/30 shadow-xl">
                <Bot className="h-10 w-10 text-white" />
              </div>

              {/* Ondas Sonoras Visualizer */}
              <div className="flex items-end justify-center gap-1 mt-3">
                {[12, 24, 18, 30, 15, 26, 14].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-white/80 animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
              Qual desafio vamos destravar hoje?
            </h2>
            <p className="mt-1 text-sm text-white/90 max-w-sm mx-auto leading-relaxed">
              Converse por texto ou grave seu áudio para receber análise instantânea de postura, tom e dicção.
            </p>

            {/* Seletor de Modo Rápido */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-md">
              {modes.map((m) => {
                const IconComponent = m.icon;
                const isSelected = selectedMode === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-white text-primary font-bold shadow-md scale-105"
                        : "bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Botão Principal de Início */}
            <Link
              to="/ai/chat"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg hover:bg-white/95 transition-transform hover:scale-105"
            >
              <span>Conversar com o Thorel</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>

        {/* Card de Desafio Diário da IA */}
        <Card className="rounded-3xl border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-card to-primary/5 p-4.5 shadow-soft border relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-soft">
                <Flame className="h-6 w-6 fill-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge className="bg-amber-500 text-white font-extrabold text-[10px] uppercase rounded-full">
                    Desafio Diário da IA
                  </Badge>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">+150 XP</span>
                </div>

                <h3 className="text-sm font-bold text-foreground leading-snug">
                  Pitch Relâmpago de 45 Segundos
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Grave um discurso sobre "Por que a comunicação transforma carreiras" com zero vícios de fala ('éee', 'né').
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-amber-500/20 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">Recompensa: Distintivo Mestre do Pitch</span>
            <Link
              to="/ai/chat"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Aceitar Desafio <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Grid de Módulos e Ferramentas da IA */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3">Módulos de Treinamento Inteligente</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => {
              const IconComp = mod.icon;

              return (
                <Link key={mod.label} to={mod.to} className="block group">
                  <Card className="rounded-3xl border-border p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-soft hover:-translate-y-1 bg-card h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-soft text-primary group-hover:scale-110 transition-transform">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className={`rounded-full text-[10px] px-2.5 py-0.5 font-bold ${mod.badgeColor}`}>
                          {mod.badge}
                        </Badge>
                      </div>

                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {mod.label}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-border/50 flex items-center justify-end text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Acessar</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

