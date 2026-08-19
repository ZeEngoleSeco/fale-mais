import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Star, ThumbsUp, AlertCircle, Clock, Sparkles } from "lucide-react";
import { MOCK_HISTORY, type AIHistoryItem } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/ai/history")({
  head: () => ({ meta: [{ title: "Histórico de Sessões — Fale+" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>("hist-1");

  const toggleExpand = (id: string) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  return (
    <AppShell>
      <PageHeader
        title="Histórico de Treinos"
        subtitle="Relatórios e pontuações de todas as suas sessões"
        back="/ai"
      />
      <div className="px-5 space-y-3 pb-12">
        {MOCK_HISTORY.map((h) => {
          const isExpanded = expandedId === h.id;
          return (
            <Card
              key={h.id}
              className="rounded-3xl border-border p-4.5 transition hover:shadow-soft"
            >
              <div
                onClick={() => toggleExpand(h.id)}
                className="flex items-center gap-3.5 cursor-pointer select-none"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-base font-extrabold text-white shadow-soft">
                  {h.score > 0 ? h.score.toFixed(1) : "—"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-foreground">{h.type}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {h.date} · {h.duration}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-3.5 border-t border-border/50 space-y-3 animate-in fade-in duration-200">
                  <div className="rounded-2xl bg-secondary/50 p-3 text-xs text-foreground leading-relaxed">
                    <span className="font-bold text-primary block mb-1">Resumo da Avaliação da IA:</span>
                    {h.feedbackSummary}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
                        <ThumbsUp className="h-3.5 w-3.5" /> Pontos Fortes
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        {h.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
                      <p className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1.5">
                        <AlertCircle className="h-3.5 w-3.5" /> Aprimorar
                      </p>
                      <ul className="space-y-1 text-muted-foreground">
                        {h.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-amber-500 font-bold">•</span> {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
