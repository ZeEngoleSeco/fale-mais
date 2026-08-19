import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Users, Clock, Mic, Star, Sparkles, Activity } from "lucide-react";
import { MOCK_ROOMS } from "@/data/mock-data";

export const Route = createFileRoute("/rooms/$id/overview")({
  head: () => ({ meta: [{ title: "Visão Geral da Sala — Fale+" }] }),
  component: Overview,
});

function Overview() {
  const { id } = Route.useParams();
  const room = MOCK_ROOMS.find((r) => r.id === id) || MOCK_ROOMS[0];

  return (
    <AppShell>
      <PageHeader title="Visão Geral" subtitle={room.name} back="/rooms/$id" />
      <div className="px-5 space-y-4 pb-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric icon={Users} label="Participantes" value={`${room.peopleCount}/${room.maxPeople}`} />
          <Metric icon={Clock} label="Tempo médio" value="3m 15s" />
          <Metric icon={Mic} label="Apresentações" value="34" />
          <Metric icon={Star} label="Nota Média" value="4.9" />
        </div>

        <Card className="rounded-3xl border-border p-5 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Activity className="h-4 w-4 text-primary" />
            <span>Últimas Atividades na Sala</span>
          </div>
          <ul className="mt-4 space-y-3 text-xs">
            {[
              ["João Ribeiro iniciou apresentação de Pitch", "há 1 min"],
              ["Marina Alves enviou um aplauso no chat", "há 2 min"],
              ["Lucas Duarte entrou na sala", "há 6 min"],
              ["Carlos Eduardo configurou tempo limite de 3 min", "há 15 min"],
              ["Sessão iniciada pelo Host", "há 28 min"],
            ].map(([act, time]) => (
              <li key={act} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                <span className="text-foreground font-medium">{act}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="rounded-3xl border-border p-4 shadow-xs">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-soft">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
    </Card>
  );
}
