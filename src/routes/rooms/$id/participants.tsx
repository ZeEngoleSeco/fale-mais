import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Mic, Hand, UserPlus } from "lucide-react";
import { MOCK_ROOMS } from "@/data/mock-data";

export const Route = createFileRoute("/rooms/$id/participants")({
  head: () => ({ meta: [{ title: "Participantes — Fale+" }] }),
  component: Participants,
});

function Participants() {
  const { id } = Route.useParams();
  const room = MOCK_ROOMS.find((r) => r.id === id) || MOCK_ROOMS[0];

  return (
    <AppShell>
      <PageHeader
        title="Participantes"
        subtitle={`${room.name} (${room.participants.length})`}
        back="/rooms/$id"
      />
      <div className="px-5 space-y-2">
        {room.participants.map((p) => (
          <Card key={p.id} className="flex items-center gap-3 rounded-2xl border-border p-3.5 shadow-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-soft text-sm font-bold text-primary">
              {p.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-foreground">{p.name}</p>
                {p.hasHandRaised && (
                  <span className="text-xs" title="Mão levantada">✋</span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant={p.role === "Host" ? "default" : p.role === "Orador" ? "secondary" : "outline"}
                  className="rounded-full text-[10px] px-2 py-0"
                >
                  {p.role}
                </Badge>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                </span>
              </div>
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
