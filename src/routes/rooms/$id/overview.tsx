import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Users, Clock, Mic, Star } from "lucide-react";

export const Route = createFileRoute("/rooms/$id/overview")({
  head: () => ({ meta: [{ title: "Visão geral — Fale+" }] }),
  component: Overview,
});

function Overview() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <PageHeader title="Visão geral" subtitle={`Sala ${id}`} back="/rooms/$id" />
      <div className="px-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={Users} label="Participantes" value="12" />
          <Metric icon={Clock} label="Tempo médio" value="4m 32s" />
          <Metric icon={Mic} label="Apresentações" value="47" />
          <Metric icon={Star} label="Avaliação" value="4.8" />
        </div>

        <Card className="rounded-3xl p-5">
          <p className="text-sm font-semibold">Últimas atividades</p>
          <ul className="mt-3 space-y-3 text-sm">
            {[
              ["Marina apresentou", "há 2 min"],
              ["Lucas entrou na sala", "há 8 min"],
              ["Nova sessão criada", "hoje 09:15"],
            ].map(([a, b]) => (
              <li key={a} className="flex items-center justify-between">
                <span>{a}</span>
                <span className="text-xs text-muted-foreground">{b}</span>
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
    <Card className="rounded-3xl p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-soft">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}
