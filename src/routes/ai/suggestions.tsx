import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Lightbulb, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/ai/suggestions")({
  head: () => ({ meta: [{ title: "Sugestões da IA — Fala que eu te escuto" }] }),
  component: Suggestions,
});

const items = [
  "Melhore sua postura",
  "Fala que eu te escuto mais devagar",
  "Olhe para o público",
  "Respire antes de responder",
  "Melhore sua introdução",
  "Use pausas estratégicas",
];

function Suggestions() {
  return (
    <AppShell>
      <PageHeader title="Sugestões da IA" back="/ai" />
      <div className="px-5 space-y-2">
        {items.map((t) => (
          <Card key={t} className="flex items-center gap-3 rounded-2xl border-border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
              <Lightbulb className="h-4 w-4" />
            </div>
            <p className="flex-1 text-sm font-medium">{t}</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
