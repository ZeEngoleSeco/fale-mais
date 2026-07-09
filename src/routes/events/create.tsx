import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/create")({
  head: () => ({ meta: [{ title: "Criar evento — Fala que eu te escuto" }] }),
  component: CreateEvent,
});

function CreateEvent() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<"online" | "presencial">("online");
  return (
    <AppShell>
      <PageHeader title="Novo evento" back="/events" />
      <form
        className="px-5 space-y-4"
        onSubmit={(e) => { e.preventDefault(); navigate({ to: "/events" }); }}
      >
        <Card className="rounded-3xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
            {(["online", "presencial"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-xl py-2 text-sm font-semibold capitalize transition ${
                  kind === k ? "bg-white shadow-soft text-primary" : "text-muted-foreground"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <button type="button" className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Adicionar imagem</span>
          </button>

          <Stack label="Título"><Input className="h-11 rounded-2xl" placeholder="Ex.: Meetup de Oratória" /></Stack>
          <Stack label="Descrição"><Textarea className="min-h-24 rounded-2xl" placeholder="Sobre o evento" /></Stack>
          {kind === "presencial" && (
            <Stack label="Local"><Input className="h-11 rounded-2xl" placeholder="Endereço completo" /></Stack>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Stack label="Data"><Input type="date" className="h-11 rounded-2xl" /></Stack>
            <Stack label="Horário"><Input type="time" className="h-11 rounded-2xl" /></Stack>
          </div>
          <Stack label="Máx. participantes"><Input type="number" defaultValue={50} className="h-11 rounded-2xl" /></Stack>
        </Card>

        <Button type="submit" className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft">
          Criar evento
        </Button>
      </form>
    </AppShell>
  );
}

function Stack({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
