import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, CheckCircle2, Clock, Share2, Sparkles } from "lucide-react";
import { MOCK_EVENTS } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/events/offline/$id")({
  head: () => ({ meta: [{ title: "Evento Presencial — Fale+" }] }),
  component: OfflineEvent,
});

function OfflineEvent() {
  const { id } = Route.useParams();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];
  const [confirmed, setConfirmed] = useState(false);

  return (
    <AppShell>
      <PageHeader title="Detalhes do Evento" subtitle={event.category} back="/events" />
      <div className="px-5 space-y-4 pb-12">
        {/* Banner Ilustrativo */}
        <Card className="overflow-hidden rounded-3xl border-0 p-0 shadow-md">
          <div className="relative aspect-[16/9] bg-gradient-brand flex flex-col justify-end p-5 text-white">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white rounded-full">{event.kind}</Badge>
              <Badge className="bg-white/20 text-white rounded-full">{event.category}</Badge>
            </div>
            <h2 className="mt-2 text-xl font-extrabold leading-tight text-white">{event.title}</h2>
          </div>
        </Card>

        <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>

        {/* Informações de Local e Data */}
        <Card className="rounded-3xl border-border p-4 space-y-3 shadow-xs">
          <Row icon={Calendar} label={event.fullDate} sublabel={event.time} />
          <Row icon={MapPin} label={event.place} sublabel="Local com estacionamento e acessibilidade" />
          <Row icon={Users} label={`${event.confirmedCount + (confirmed ? 1 : 0)} participantes confirmados`} sublabel={`Capacidade máxima: ${event.maxCapacity} pessoas`} />
        </Card>

        {/* Palestrantes / Mentores */}
        {event.speakers.length > 0 && (
          <Card className="rounded-3xl border-border p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Palestrantes Convidados</p>
            <div className="space-y-3">
              {event.speakers.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-soft text-sm font-bold text-primary">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role} · {s.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Cronograma / Agenda */}
        {event.agenda.length > 0 && (
          <Card className="rounded-3xl border-border p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Cronograma do Encontro</p>
            <div className="space-y-2.5 text-xs">
              {event.agenda.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <span className="rounded-md bg-secondary px-2 py-1 font-mono font-bold text-primary shrink-0">{item.time}</span>
                  <span className="pt-0.5 text-foreground leading-relaxed">{item.activity}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Organizador */}
        <Card className="rounded-3xl border-border p-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Organizador</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-sm font-bold text-white shadow-soft">
              {event.organizer.initials}
            </div>
            <div>
              <p className="text-sm font-bold">{event.organizer.name}</p>
              <p className="text-xs text-muted-foreground">{event.organizer.eventsHeld} encontros realizados pela comunidade</p>
            </div>
          </div>
        </Card>

        {/* Botão de Confirmação */}
        <Button
          onClick={() => setConfirmed(!confirmed)}
          className={`h-12 w-full rounded-2xl text-base font-semibold shadow-soft transition ${
            confirmed
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gradient-brand text-white"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 mr-1.5" />
          {confirmed ? "Presença Confirmada! (Clique para cancelar)" : "Confirmar Presença Gratuitamente"}
        </Button>
      </div>
    </AppShell>
  );
}

function Row({ icon: Icon, label, sublabel }: { icon: any; label: string; sublabel?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}
