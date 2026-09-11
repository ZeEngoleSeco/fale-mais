import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Share2,
  Star,
  Award,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Navigation,
  MessageSquare,
  Building2,
} from "lucide-react";
import { MOCK_EVENTS } from "@/data/mock-data";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/events/offline/$id")({
  head: () => ({ meta: [{ title: "Evento Presencial — Fale+" }] }),
  component: OfflineEvent,
});

function OfflineEvent() {
  const { id } = Route.useParams();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];

  const [marked, setMarked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fale_mais_marked_events");
      if (stored) {
        try {
          const list: string[] = JSON.parse(stored);
          return list.includes(event.id);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return true;
  });

  const [confirmed, setConfirmed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fale_mais_confirmed_events");
      if (stored) {
        try {
          const list: string[] = JSON.parse(stored);
          return list.includes(event.id);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return false;
  });

  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);

  const toggleBookmark = () => {
    setMarked((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("fale_mais_marked_events");
        let list: string[] = stored ? JSON.parse(stored) : [];
        if (next) {
          if (!list.includes(event.id)) list.push(event.id);
          toast.success("Evento salvo nos seus Marcados! ⭐");
        } else {
          list = list.filter((i) => i !== event.id);
          toast.info("Evento removido dos marcados.");
        }
        localStorage.setItem("fale_mais_marked_events", JSON.stringify(list));
      }
      return next;
    });
  };

  const toggleRSVP = () => {
    setConfirmed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("fale_mais_confirmed_events");
        let list: string[] = stored ? JSON.parse(stored) : [];
        if (next) {
          if (!list.includes(event.id)) list.push(event.id);
          toast.success("Presença confirmada no evento! 🎉", {
            description: "Você receberá lembretes e atualizações sobre o local.",
          });
          // Auto mark if confirmed
          setMarked(true);
        } else {
          list = list.filter((i) => i !== event.id);
          toast.info("Sua inscrição foi cancelada.");
        }
        localStorage.setItem("fale_mais_confirmed_events", JSON.stringify(list));
      }
      return next;
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link do evento copiado!", {
        description: "Pronto para compartilhar com seus contatos.",
      });
    }
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(event.place);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const effectiveCount = event.confirmedCount + (confirmed ? 1 : 0);
  const percentFilled = Math.min(100, Math.round((effectiveCount / event.maxCapacity) * 100));

  return (
    <AppShell>
      <Toaster position="top-center" />
      <PageHeader title="Detalhes do Evento" subtitle={event.category} back="/events" />

      <div className="px-5 space-y-4 pb-28">
        {/* Banner Ilustrativo Interativo Compacto */}
        <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-md relative group">
          <div className="relative min-h-[140px] bg-gradient-brand flex flex-col justify-between p-4 text-white">
            {/* Top Bar inside Banner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Badge className="bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-[10px] border-0 px-2 py-0.5">
                  📍 {event.kind}
                </Badge>
                <Badge className="bg-amber-400 text-slate-950 rounded-full font-extrabold text-[10px] border-0 px-2 py-0.5">
                  {event.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleBookmark}
                  className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                    marked
                      ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                      : "bg-black/30 text-white hover:bg-black/40"
                  }`}
                  title={marked ? "Salvo nos marcados" : "Salvar evento"}
                >
                  <Star className={`h-3.5 w-3.5 ${marked ? "fill-slate-950" : ""}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                  title="Compartilhar evento"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Title inside Banner */}
            <div className="mt-3">
              <span className="text-[10px] font-semibold text-amber-200 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Encontro Presencial Fale+
              </span>
              <h2 className="mt-0.5 text-lg font-extrabold leading-snug text-white tracking-tight">
                {event.title}
              </h2>
            </div>
          </div>
        </Card>

        {/* Descrição resumida com badge de presença */}
        {confirmed && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in fade-in-50">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <p className="font-bold">Sua vaga está garantida!</p>
              <p className="text-[11px] opacity-90 font-normal">Apresente seu nome ou QR Code na entrada do local.</p>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed font-normal">
          {event.desc}
        </p>

        {/* Grid de Informações Chave */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-2xl border-border p-3.5 bg-card hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 text-primary" /> Data e Horário
            </div>
            <p className="text-sm font-bold text-foreground">{event.date}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
          </Card>

          <Card className="rounded-2xl border-border p-3.5 bg-card hover:border-primary/30 transition-all">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Award className="h-4 w-4 text-amber-500" /> Benefícios
            </div>
            <p className="text-sm font-bold text-foreground">Certificado + XP</p>
            <p className="text-xs text-muted-foreground mt-0.5">Networking e dinâmicas</p>
          </Card>
        </div>

        {/* Card de Localização com Botão do Google Maps */}
        <Card className="rounded-3xl border-border p-4.5 space-y-3 shadow-xs bg-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Endereço do Encontro</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{event.place}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  ✓ Estacionamento no local e acessibilidade PCD
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={openGoogleMaps}
            className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Navigation className="h-3.5 w-3.5" /> Abrir no Google Maps <ExternalLink className="h-3 w-3 ml-0.5" />
          </Button>
        </Card>

        {/* Progresso de Lotação e Comunidade */}
        <Card className="rounded-3xl border-border p-4.5 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" /> Participantes Confirmados
            </span>
            <span className="text-xs font-bold text-primary">
              {effectiveCount} / {event.maxCapacity} pessoas
            </span>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentFilled >= 90
                    ? "bg-rose-500"
                    : percentFilled >= 75
                    ? "bg-amber-500"
                    : "bg-gradient-brand"
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{percentFilled}% da capacidade preenchida</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {event.maxCapacity - effectiveCount} vagas restantes
              </span>
            </div>
          </div>

          {/* Avatares dos Participantes */}
          <div className="pt-2 flex items-center gap-3 border-t border-border/60">
            <div className="flex -space-x-2 overflow-hidden">
              {["AL", "CE", "LU", "MA", "JP"].map((init, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white ring-2 ring-card shadow-xs"
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {confirmed ? "Você e +41 membros" : "42 membros da Fale+"} já garantiram presença!
            </span>
          </div>
        </Card>

        {/* Palestrantes Convidados */}
        {event.speakers && event.speakers.length > 0 && (
          <Card className="rounded-3xl border-border p-4.5 bg-card space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                Palestrantes & Especialistas
              </p>
              <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0.5 font-bold">
                {event.speakers.length} Convidados
              </Badge>
            </div>

            <div className="space-y-3">
              {event.speakers.map((s) => {
                const isExpanded = expandedSpeaker === s.name;

                return (
                  <div
                    key={s.name}
                    className="rounded-2xl border border-border/80 bg-secondary/30 p-3.5 transition-all hover:border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-sm font-bold text-white shadow-soft">
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground flex items-center gap-1">
                          {s.name} <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.role} · <span className="font-semibold text-foreground/80">{s.company}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedSpeaker(isExpanded ? null : s.name)}
                        className="text-xs font-semibold text-primary p-1 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground space-y-1.5 animate-in fade-in-50">
                        <p className="font-medium text-foreground">
                          Especialista em oratória de alto impacto, comunicação assertiva e linguagem corporal.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-bold">
                            TEDx Speaker
                          </span>
                          <span className="rounded-full bg-secondary text-foreground px-2.5 py-0.5 text-[10px] font-bold">
                            Mentor Fale+
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Cronograma do Encontro (Linha do Tempo Visual) */}
        {event.agenda && event.agenda.length > 0 && (
          <Card className="rounded-3xl border-border p-4.5 bg-card space-y-3">
            <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-2">
              Cronograma do Encontro
            </p>

            <div className="relative pl-3 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-brand">
              {event.agenda.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-3 group">
                  {/* Bolinha da timeline */}
                  <span className="absolute -left-[5px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20 group-hover:scale-125 transition-transform" />

                  <div className="flex-1 rounded-2xl bg-secondary/40 p-3 border border-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="rounded-md bg-gradient-brand px-2 py-0.5 font-mono text-[10px] font-extrabold text-white">
                        {item.time}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">Bloco {idx + 1}</span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-relaxed">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Card do Organizador */}
        <Card className="rounded-3xl border-border p-4.5 bg-card">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-3">
            Organizado Por
          </p>
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-base font-bold text-white shadow-soft">
              {event.organizer?.initials || "FM"}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground flex items-center gap-1">
                {event.organizer?.name || "Comunidade Fale+"}
                <ShieldCheck className="h-4 w-4 text-primary" />
              </p>
              <p className="text-xs text-muted-foreground">
                {event.organizer?.eventsHeld || 18} encontros organizados com 100% de avaliação positiva
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Barra de Ação Flutuante Fixo no Rodapé */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-2 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-md">
        <Button
          onClick={toggleRSVP}
          className={`h-13 w-full rounded-2xl text-base font-bold shadow-lift transition-all ${
            confirmed
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gradient-brand text-white hover:opacity-95"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          {confirmed ? "Presença Confirmada 🎉 (Clique para cancelar)" : "Confirmar Presença Gratuitamente"}
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

