import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";

export const Route = createFileRoute("/rooms/$id/participants")({
  head: () => ({ meta: [{ title: "Participantes — Fale+" }] }),
  component: Participants,
});

const people = [
  { name: "João Ribeiro", role: "Administrador", init: "JR" },
  { name: "Marina Alves", role: "Convidado", init: "MA" },
  { name: "Lucas Duarte", role: "Convidado", init: "LU" },
  { name: "Camila Souza", role: "Convidado", init: "CA" },
];

function Participants() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <PageHeader title="Participantes" subtitle={`Sala ${id}`} back="/rooms/$id" />
      <div className="px-5 space-y-2">
        {people.map((p) => (
          <Card key={p.name} className="flex items-center gap-3 rounded-2xl border-border p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-soft text-sm font-bold text-primary">
              {p.init}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.role} · Online</p>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
