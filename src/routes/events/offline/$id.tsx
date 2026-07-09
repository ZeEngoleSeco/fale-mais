import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/events/offline/$id")({
  head: () => ({ meta: [{ title: "Evento presencial — Fale+" }] }),
  component: OfflineEvent,
});

function OfflineEvent() {
  return (
    <AppShell>
      <PageHeader title="Detalhes do evento" back="/events" />
      <div className="px-5 space-y-4">
        <Card className="overflow-hidden rounded-3xl border-0 p-0">
          <div className="relative aspect-[4/3] bg-gradient-soft">
            <div className="absolute inset-0 flex items-center justify-center text-primary/60">
              <MapPin className="h-16 w-16" strokeWidth={1.4} />
            </div>
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-40">
              <path d="M0 150 Q100 100 200 160 T400 140" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" />
              <path d="M50 220 L200 180 L350 250" stroke="currentColor" strokeWidth="2" fill="none" className="text-brand-2" />
            </svg>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-bold">Meetup: Falar em público sem medo</h2>
          <p className="mt-1 text-sm text-muted-foreground">Uma noite de práticas, conexões e feedbacks reais.</p>
        </div>

        <Card className="rounded-3xl p-4 space-y-3">
          <Row icon={Calendar} label="Sábado, 15 de fevereiro · 19h" />
          <Row icon={MapPin} label="Av. Paulista, 1000 — São Paulo, SP" />
          <Row icon={Users} label="42 participantes confirmados" />
        </Card>

        <Card className="rounded-3xl p-4">
          <p className="text-xs font-semibold text-muted-foreground">Organizador</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">FM</div>
            <div>
              <p className="text-sm font-semibold">Comunidade Fale+ SP</p>
              <p className="text-xs text-muted-foreground">18 eventos realizados</p>
            </div>
          </div>
        </Card>

        <Button className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft">
          <CheckCircle2 className="h-4 w-4" /> Confirmar presença
        </Button>
      </div>
    </AppShell>
  );
}

function Row({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
