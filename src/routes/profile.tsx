import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, Edit3, Mic, Users, Trophy, ChevronRight, Palette, Flame, Clock, Star, Award, LogOut, CheckCircle2, Lock } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThemeSelector } from "@/components/theme-toggle";
import { CURRENT_USER } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — Fale+" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [user] = useState(CURRENT_USER);
  const xpPercent = Math.round((user.xp / user.xpNextLevel) * 100);

  return (
    <AppShell>
      <PageHeader
        title="Meu Perfil"
        subtitle="Evolução, conquistas e configurações"
        action={
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:text-foreground"
            title="Sair / Trocar de conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        }
      />
      <div className="px-5 space-y-5">
        {/* Main Profile Card */}
        <Card className="flex flex-col items-center rounded-3xl border-border p-6 text-center shadow-sm">
          <div className="relative">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarColor} text-3xl font-bold text-white shadow-lift`}>
              {user.initials}
            </div>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-background px-2.5 py-0.5 text-xs font-bold text-primary shadow border border-border">
              Nv. {user.level}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
          <p className="text-sm font-medium text-primary">{user.role}</p>
          <p className="mt-2 text-xs text-muted-foreground max-w-xs">{user.bio}</p>

          <div className="mt-5 grid w-full grid-cols-4 gap-2">
            <Stat icon={Mic} label="Apresentações" value={String(user.stats.presentations)} />
            <Stat icon={Star} label="Nota Média" value={String(user.stats.averageScore)} />
            <Stat icon={Clock} label="Horas" value={`${user.stats.hoursPracticed}h`} />
            <Stat icon={Trophy} label="Conquistas" value={String(user.stats.achievementsCount)} />
          </div>

          <div className="mt-5 w-full text-left rounded-2xl bg-secondary/50 p-3.5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold">Nível {user.level} → Nível {user.level + 1}</span>
              <span className="text-muted-foreground font-medium">{user.xp} / {user.xpNextLevel} XP ({xpPercent}%)</span>
            </div>
            <Progress value={xpPercent} className="h-2.5" />
          </div>
        </Card>

        {/* Conquistas / Badges */}
        <Card className="rounded-3xl border-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">Conquistas & Distintivos</h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {user.badges.filter(b => b.unlocked).length} de {user.badges.length} desbloqueados
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-start gap-3 rounded-2xl border p-3 transition ${
                  badge.unlocked
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-secondary/30 opacity-60"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    badge.unlocked
                      ? "bg-gradient-brand text-white shadow-soft"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {badge.unlocked ? <Trophy className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-xs font-bold text-foreground">{badge.title}</p>
                    {badge.unlocked && (
                      <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">Desbloqueado</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tema & Aparência */}
        <Card className="rounded-3xl border-border p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Palette className="h-4 w-4 text-primary" />
            <span>Aparência e Tema</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Personalize as cores e o modo claro/escuro da interface.
          </p>
          <div className="mt-4">
            <ThemeSelector />
          </div>
        </Card>

        {/* Links Rápidos */}
        <div className="space-y-2 pb-6">
          <ProfileRow to="/ai/insights" label="Meus Insights de Oratória" desc="Métricas vocais, pausas e postura" />
          <ProfileRow to="/ai/history" label="Histórico de Treinos" desc="Veja relatórios de todas as sessões" />
          <ProfileRow to="/rooms" label="Salas de Prática" desc="Participe de salas ao vivo ou crie a sua" />
          <ProfileRow to="/events" label="Eventos e Workshops" desc="Encontros online e presenciais" />
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 px-2 py-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-base font-extrabold">{value}</p>
      <p className="text-[9px] text-muted-foreground font-medium leading-none">{label}</p>
    </div>
  );
}

function ProfileRow({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:bg-secondary/50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

