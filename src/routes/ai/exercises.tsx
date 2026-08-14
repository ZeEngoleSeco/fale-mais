import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, CheckCircle2, Clock, Dumbbell, X, Volume2 } from "lucide-react";
import { MOCK_EXERCISES, type ExerciseItem } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/ai/exercises")({
  head: () => ({ meta: [{ title: "Exercícios de Oratória — Fale+" }] }),
  component: Exercises,
});

const cats = ["Todos", "Improviso", "Pitch", "Respiração", "Dicção", "Expressão"];

function Exercises() {
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const filteredList = MOCK_EXERCISES.filter(
    (e) => selectedCat === "Todos" || e.category === selectedCat
  );

  return (
    <AppShell>
      <PageHeader
        title="Catálogo de Exercícios"
        subtitle="Treinos práticos para dicção, ritmo e presença"
        back="/ai"
      />

      <div className="px-5 space-y-4 pb-12">
        {/* Filtro de Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedCat === c
                  ? "bg-gradient-brand text-white shadow-soft"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lista de Exercícios */}
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {filteredList.map((e) => (
            <Card
              key={e.id}
              className="rounded-3xl border-border p-4.5 transition hover:shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    {e.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {e.completionsCount} praticantes
                  </span>
                </div>
                <h3 className="mt-2 text-[15px] font-bold text-foreground">{e.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{e.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    <Clock className="h-3 w-3 mr-1" /> {e.duration}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`rounded-full text-[10px] ${
                      e.level === "Iniciante"
                        ? "text-emerald-600 border-emerald-500/30"
                        : e.level === "Médio"
                        ? "text-amber-600 border-amber-500/30"
                        : "text-rose-600 border-rose-500/30"
                    }`}
                  >
                    {e.level}
                  </Badge>
                </div>

                <button
                  onClick={() => {
                    setActiveExercise(e);
                    setIsCompleted(false);
                  }}
                  className="flex h-10 items-center gap-1.5 rounded-full bg-gradient-brand px-4 text-xs font-semibold text-white shadow-soft transition hover:opacity-90"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Treinar
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal / Card Interativo de Execução do Exercício */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md rounded-3xl border-border bg-card p-6 shadow-lift max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-gradient-brand text-white rounded-full text-[10px]">
                  {activeExercise.category} · {activeExercise.duration}
                </Badge>
                <h3 className="mt-2 text-xl font-bold">{activeExercise.name}</h3>
              </div>
              <button
                onClick={() => setActiveExercise(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{activeExercise.desc}</p>

            <div className="mt-4 space-y-2 rounded-2xl bg-secondary/50 p-4">
              <p className="text-xs font-bold text-foreground">Passo a Passo:</p>
              <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                {activeExercise.instructions.map((ins, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeExercise.tips.length > 0 && (
              <div className="mt-3 space-y-1 rounded-2xl bg-primary/5 border border-primary/20 p-3.5 text-xs text-primary">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Dica do Mentor:
                </p>
                {activeExercise.tips.map((t, idx) => (
                  <p key={idx} className="text-[11px] text-foreground/90">{t}</p>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => setIsCompleted(true)}
                className={`h-11 w-full rounded-2xl text-xs font-bold shadow-soft transition flex items-center justify-center gap-2 ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-gradient-brand text-white hover:opacity-95"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isCompleted ? "Exercício Concluído! (+30 XP)" : "Concluir Exercício"}
              </button>
              <Link
                to="/ai/chat"
                className="h-10 w-full rounded-2xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary flex items-center justify-center transition"
              >
                Praticar com a IA no Chat →
              </Link>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
