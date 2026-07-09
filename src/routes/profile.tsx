import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Edit3, Mic, Users, Trophy, ChevronRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — Fala que eu te escuto+" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell>
      <PageHeader
        title="Perfil"
        action={
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
            <Settings className="h-4 w-4" />
          </button>
        }
      />
      <div className="px-5">
        <Card className="flex flex-col items-center rounded-3xl border-border p-6 text-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-brand text-3xl font-bold text-white shadow-lift">
              AL
            </div>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-primary shadow">
              Nv. 7
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold">Ana Lima</h2>
          <p className="text-sm text-muted-foreground">Oradora em evolução</p>

          <div className="mt-5 grid w-full grid-cols-3 gap-3">
            <Stat icon={Mic} label="Apresentações" value="24" />
            <Stat icon={Users} label="Salas criadas" value="6" />
            <Stat icon={Trophy} label="Conquistas" value="12" />
          </div>

          <div className="mt-5 w-full text-left">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">Progresso do nível 7</span>
              <span className="text-muted-foreground">720 / 1000 XP</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>

          <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft">
            <Edit3 className="h-4 w-4" /> Editar perfil
          </button>
        </Card>

        <div className="mt-6 space-y-2">
          <ProfileRow to="/ai/insights" label="Meus insights" desc="Pontos fortes e evolução" />
          <ProfileRow to="/ai/history" label="Histórico" desc="Todas as sessões" />
          <ProfileRow to="/rooms" label="Minhas salas" desc="Salas que criei ou participo" />
          <ProfileRow to="/events" label="Meus eventos" desc="Presenciais e online" />
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 px-2 py-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
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
