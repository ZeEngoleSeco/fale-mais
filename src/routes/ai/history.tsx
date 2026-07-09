import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/ai/history")({
  head: () => ({ meta: [{ title: "Histórico — Fala que eu te escuto+" }] }),
  component: History,
});

const list = [
  { date: "Hoje, 09:15", type: "Pitch de 60s", time: "1m 12s", score: "8.7" },
  { date: "Ontem, 21:04", type: "Improviso", time: "2m 30s", score: "7.9" },
  { date: "Seg, 18:22", type: "Respiração", time: "5m 00s", score: "—" },
  { date: "Dom, 10:11", type: "Apresentação", time: "9m 45s", score: "8.2" },
];

function History() {
  return (
    <AppShell>
      <PageHeader title="Histórico" back="/ai" />
      <div className="px-5 space-y-2">
        {list.map((h, i) => (
          <Card key={i} className="flex items-center gap-3 rounded-2xl border-border p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-soft text-sm font-bold text-primary">
              {h.score}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{h.type}</p>
              <p className="text-xs text-muted-foreground">{h.date} · {h.time}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
