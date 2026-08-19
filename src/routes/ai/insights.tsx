import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_INSIGHTS_METRICS } from "@/data/mock-data";

export const Route = createFileRoute("/ai/insights")({
  head: () => ({ meta: [{ title: "Insights & Métricas de Oratória — Fale+" }] }),
  component: Insights,
});

const evolutionData = [
  { label: "Sem 1", val: 52 },
  { label: "Sem 2", val: 61 },
  { label: "Sem 3", val: 58 },
  { label: "Sem 4", val: 70 },
  { label: "Sem 5", val: 68 },
  { label: "Sem 6", val: 76 },
  { label: "Sem 7", val: 82 },
  { label: "Sem 8", val: 89 },
];

function Insights() {
  return (
    <AppShell>
      <PageHeader
        title="Meus Insights de Oratória"
        subtitle="Análise biométrica e linguística das suas falas"
        back="/ai"
      />
      <div className="px-5 space-y-4 pb-12">
        {/* Gráfico de Evolução */}
        <Card className="rounded-3xl border-border p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Evolução do Índice de Domínio Verbal</p>
              <p className="text-xs text-muted-foreground">+37% de melhora nas últimas 8 semanas</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3.5 w-3.5" /> Nv. 7 (89 pts)
            </span>
          </div>

          <div className="mt-6 flex h-36 items-end gap-2.5 pt-2">
            {evolutionData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-muted-foreground">{d.val}%</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-brand transition-all hover:opacity-90 shadow-xs"
                  style={{ height: `${d.val}%` }}
                />
                <span className="text-[9px] text-muted-foreground font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Diagnóstico Rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="rounded-3xl border-border p-4 bg-emerald-500/5 border-emerald-500/20">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Principais Pontos Fortes
            </p>
            <ul className="mt-2.5 space-y-1.5 text-xs text-foreground/90 leading-relaxed">
              <li>• <strong>Articulação cristalina</strong> das palavras e fonemas.</li>
              <li>• <strong>Uso de pausas assertivas</strong> após dados impactantes.</li>
              <li>• <strong>Excelente energia e entusiasmo</strong> na introdução.</li>
            </ul>
          </Card>

          <Card className="rounded-3xl border-border p-4 bg-amber-500/5 border-amber-500/20">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Próximas Oportunidades
            </p>
            <ul className="mt-2.5 space-y-1.5 text-xs text-foreground/90 leading-relaxed">
              <li>• <strong>Contato visual</strong>: Evitar olhar para baixo no fechamento.</li>
              <li>• <strong>Modulação de volume</strong>: Variar o tom para gerar mistério.</li>
              <li>• <strong>Reduzir o 'né?'</strong> ao final de conclusões.</li>
            </ul>
          </Card>
        </div>

        {/* Detalhamento das Métricas */}
        <Card className="rounded-3xl border-border p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Pilares Avaliados</h3>
            <span className="text-xs text-muted-foreground">Atualizado hoje</span>
          </div>

          <div className="space-y-4">
            {MOCK_INSIGHTS_METRICS.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 rounded-full font-semibold capitalize ${
                        m.status === "excelente"
                          ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                          : m.status === "bom"
                          ? "text-blue-600 border-blue-500/30 bg-blue-500/10"
                          : "text-amber-600 border-amber-500/30 bg-amber-500/10"
                      }`}
                    >
                      {m.status}
                    </Badge>
                    <span className="font-extrabold text-foreground">{m.value}%</span>
                  </div>
                </div>
                <Progress value={m.value} className="h-2" />
                <p className="text-[11px] text-muted-foreground leading-tight">{m.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA para Treino */}
        <Link
          to="/ai/chat"
          className="flex items-center justify-between rounded-3xl bg-gradient-brand p-4.5 text-white shadow-soft transition hover:opacity-95"
        >
          <div>
            <p className="text-sm font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Praticar pontos a melhorar
            </p>
            <p className="text-xs opacity-90 mt-0.5">Sessão guiada de 5 minutos com o mentor Thorel</p>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </AppShell>
  );
}
