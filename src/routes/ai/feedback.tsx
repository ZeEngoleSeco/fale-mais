import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ai/feedback")({
  head: () => ({ meta: [{ title: "Feedback — Fala que eu te escuto+" }] }),
  component: Feedback,
});

function Feedback() {
  const [rating, setRating] = useState(4);
  return (
    <AppShell>
      <PageHeader title="Feedback" back="/ai" />
      <div className="px-5 space-y-4">
        <Card className="flex flex-col items-center rounded-3xl p-6 text-center">
          <p className="text-sm text-muted-foreground">Como foi sua apresentação?</p>
          <div className="mt-3 flex gap-1">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)}>
                <Star
                  className={`h-8 w-8 ${n <= rating ? "text-warning" : "text-muted-foreground/30"}`}
                  fill={n <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-2xl font-bold">{rating}.0</p>
        </Card>

        <Card className="rounded-3xl p-5 space-y-3">
          <div>
            <p className="text-xs font-semibold text-emerald-600">Pontos positivos</p>
            <p className="mt-1 text-sm">Boa clareza e estrutura sólida na introdução.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-warning">Pontos negativos</p>
            <p className="mt-1 text-sm">Ritmo acelerado no meio da fala.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary">Sugestões</p>
            <p className="mt-1 text-sm">Faça pausas de 1s após ideias-chave.</p>
          </div>
        </Card>

        <div className="space-y-1.5">
          <Textarea placeholder="Deixe um comentário..." className="min-h-28 rounded-2xl" />
        </div>

        <Button className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft">
          Salvar feedback
        </Button>
      </div>
    </AppShell>
  );
}
