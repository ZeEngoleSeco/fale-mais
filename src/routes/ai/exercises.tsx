import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, CheckCircle2, Clock, Dumbbell, X } from "lucide-react";
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
      <PageHeader title="Exercícios" back="/ai" />

      {/* Categorias de filtro */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-none">
        {cats.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`shadow-lg shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedCat === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
        {filteredList.length === 0 ? (
          <Card className="col-span-full p-8 text-center text-muted-foreground rounded-3xl border-dashed">
            <Dumbbell className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p className="text-sm font-medium">Nenhum exercício encontrado nesta categoria.</p>
          </Card>
        ) : (
          filteredList.map((e) => (
            <Card key={e.id} className="shadow-lg flex flex-col justify-between rounded-3xl border-border p-4 transition hover:shadow-soft">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-bold text-foreground">{e.name}</h3>
                  <Badge variant="secondary" className="rounded-full text-[10px] shrink-0 font-medium">
                    {e.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{e.desc}</p>
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
                        ? "text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                        : e.level === "Médio"
                        ? "text-amber-600 border-amber-500/30 dark:text-amber-400"
                        : "text-rose-600 border-rose-500/30 dark:text-rose-400"
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
                  className="shadow-lg flex h-10 items-center gap-1.5 rounded-full bg-gradient-brand px-4 text-xs font-semibold text-white shadow-soft transition hover:opacity-90 active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Treinar
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal / Card Interativo de Execução do Exercício */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="- w-full max-w-md rounded-3xl border-border bg-card p-6 shadow-lift max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-gradient-brand text-white rounded-full text-[10px]">
                  {activeExercise.category} · {activeExercise.duration}
                </Badge>
                <h3 className="mt-2 text-xl font-bold">{activeExercise.name}</h3>
              </div>
              <button
                onClick={() => setActiveExercise(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition"
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

            {activeExercise.tips && activeExercise.tips.length > 0 && (
              <div className="mt-3 space-y-1 rounded-2xl bg-primary/5 border border-primary/20 p-3.5 text-xs text-primary">
                <p className="font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Dica do Mentor:
                </p>
                {activeExercise.tips.map((t, idx) => (
                  <p key={idx} className=" text-[11px] text-foreground/90">{t}</p>
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
