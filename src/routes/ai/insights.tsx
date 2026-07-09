import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/ai/insights")({
  head: () => ({ meta: [{ title: "Insights — Fale+" }] }),
  component: Insights,
});

const metrics = [
  { label: "Confiança", value: 78 },
  { label: "Velocidade da fala", value: 62 },
  { label: "Uso de pausas", value: 71 },
  { label: "Contato visual", value: 55 },
];

function Insights() {
  return (
    <AppShell>
      <PageHeader title="Insights" back="/ai" />
      <div className="px-5 space-y-4">
        <Card className="rounded-3xl p-5">
          <p className="text-sm font-semibold text-muted-foreground">Evolução (últimos 30 dias)</p>
          <div className="mt-4 flex h-32 items-end gap-1.5">
            {[30, 45, 40, 60, 55, 72, 68, 80, 75, 88, 82, 90].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-brand-2"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-3xl p-4">
            <p className="text-xs font-semibold text-emerald-600">Pontos fortes</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Clareza</li>
              <li>• Entusiasmo</li>
              <li>• Estrutura</li>
            </ul>
          </Card>
          <Card className="rounded-3xl p-4">
            <p className="text-xs font-semibold text-warning">A melhorar</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Ritmo</li>
              <li>• Muletas</li>
              <li>• Postura</li>
            </ul>
          </Card>
        </div>

        <Card className="rounded-3xl p-5 space-y-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{m.label}</span>
                <span className="text-muted-foreground">{m.value}%</span>
              </div>
              <Progress value={m.value} className="h-2" />
            </div>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
