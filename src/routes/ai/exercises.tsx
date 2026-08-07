import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

export const Route = createFileRoute("/ai/exercises")({
  head: () => ({ meta: [{ title: "Exercícios — Fale+" }] }),
  component: Exercises,
});

const list = [
  { name: "Improviso", desc: "Fale por 60s sobre um tema surpresa", time: "1 min", lvl: "Fácil" },
  { name: "Pitch", desc: "Estruture um pitch para investidores", time: "3 min", lvl: "Médio" },
  { name: "Apresentação", desc: "Simule uma apresentação completa", time: "10 min", lvl: "Difícil" },
  { name: "Respiração", desc: "Técnica 4-7-8 para acalmar", time: "5 min", lvl: "Fácil" },
  { name: "Controle da ansiedade", desc: "Grounding e visualização", time: "8 min", lvl: "Médio" },
  { name: "Leitura em voz alta", desc: "Trabalhe dicção e ritmo", time: "5 min", lvl: "Fácil" },
];

function Exercises() {
  return (
    <AppShell>
      <PageHeader title="Exercícios" back="/ai" />
      <div className="px-5 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
        {list.map((e) => (
          <Card key={e.name} className="rounded-3xl border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">{e.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary" className="rounded-full text-[10px]">{e.time}</Badge>
                  <Badge variant="outline" className="rounded-full text-[10px]">{e.lvl}</Badge>
                </div>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft">
                <Play className="h-4 w-4" fill="currentColor" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
