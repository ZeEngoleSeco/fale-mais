import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Calendar,
  Plus,
  Users,
  Flame,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles,
  Clock,
  UserCheck,
  Video,
  Building2,
  Bookmark,
  MessageSquare,
} from "lucide-react";
import { MOCK_EVENTS, type EventItem } from "@/data/mock-data";
import { useState, useMemo, useEffect } from "react";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Eventos & Workshops — Fale+" }] }),
  component: EventsPage,
});

const cats = ["Todos", "Marcados ⭐", "Online", "Presencial", "Pitch", "Workshop", "Masterclass", "Meetup"];

export function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todos");

  // State for marked/saved events (persisted in localStorage)
  const [markedIds, setMarkedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fale_mais_marked_events");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return ["1", "2"]; // Pre-marked initial events for great demo state
  });

  // State for confirmed RSVP events
  const [confirmedIds, setConfirmedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fale_mais_confirmed_events");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return ["1"];
  });

  // State for expanded agenda accordion on cards
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fale_mais_marked_events", JSON.stringify(markedIds));
    }
  }, [markedIds]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fale_mais_confirmed_events", JSON.stringify(confirmedIds));
    }
  }, [confirmedIds]);

  const toggleBookmark = (id: string, title: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setMarkedIds((prev) => {
      const isAlreadyMarked = prev.includes(id);
      if (isAlreadyMarked) {
        toast.info(`"${title}" removido dos salvos`, {
          description: "O evento foi retirado da sua lista de marcados.",
        });
        return prev.filter((item) => item !== id);
      } else {
        toast.success(`"${title}" marcado com sucesso! ⭐`, {
          description: "Você pode visualizar este evento na aba 'Marcados ⭐'.",
        });
        return [...prev, id];
      }
    });
  };

  const toggleRSVP = (id: string, title: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setConfirmedIds((prev) => {
      const isConfirmed = prev.includes(id);
      if (isConfirmed) {
        toast.info(`Presença cancelada em "${title}"`);
        return prev.filter((item) => item !== id);
      } else {
        toast.success(`Presença confirmada em "${title}"! 🎉`, {
          description: "Adicionado aos seus eventos confirmados.",
        });
        // Auto-mark if confirmed
        setMarkedIds((mPrev) => (mPrev.includes(id) ? mPrev : [...mPrev, id]));
        return [...prev, id];
      }
    });
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = (title: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link do evento copiado!", {
        description: `Compartilhe "${title}" com sua rede.`,
      });
    } else {
      toast.success("Link copiado com sucesso!");
    }
  };

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.desc.toLowerCase().includes(search.toLowerCase()) ||
        e.place.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());

      let matchCat = true;
      if (selectedCat === "Marcados ⭐") {
        matchCat = markedIds.includes(e.id);
      } else if (selectedCat !== "Todos") {
        matchCat = e.kind === selectedCat || e.category === selectedCat;
      }

      return matchSearch && matchCat;
    });
  }, [search, selectedCat, markedIds]);

  return (
    <AppShell>
      <Toaster position="top-center" />
      <PageHeader
        title="Eventos & Workshops"
        subtitle="Encontros online e presenciais com a comunidade"
        action={
          <Link
            to="/events/create"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft transition-transform hover:scale-105"
            aria-label="Criar evento"
          >
            <Plus className="h-4 w-4" />
          </Link>
        }
      />

      <div className="px-5 space-y-4 pb-12">
        {/* Barra de Busca */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, cidade ou categoria..."
            className="h-12 rounded-2xl pl-10 transition-shadow hover:shadow-md dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Filtros de Categorias com Marcados */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {cats.map((c) => {
            const isMarcadosTab = c === "Marcados ⭐";
            const count = isMarcadosTab ? markedIds.length : null;

            return (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_6px_18px_rgba(255,255,255,0.25)] flex items-center gap-1.5 ${
                  selectedCat === c
                    ? "bg-gradient-brand text-white shadow-soft"
                    : isMarcadosTab && markedIds.length > 0
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                    : "bg-secondary text-foreground hover:bg-secondary/90"
                }`}
              >
                <span>{c}</span>
                {count !== null && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      selectedCat === c
                        ? "bg-white/30 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Banner Destaque Compacto */}
        <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative">
          <div className="bg-gradient-brand p-3.5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-white uppercase tracking-wider">
                  <Flame className="h-3 w-3 text-amber-300 fill-amber-300" /> Destaque
                </span>
                <span className="text-[10px] text-amber-200 font-medium">15 a 22 de Fev · +400 inscritos</span>
              </div>
              <h3 className="text-sm font-bold leading-snug truncate text-white">
                Semana Nacional da Oratória Fale+
              </h3>
              <p className="mt-0.5 text-xs text-white/85 line-clamp-1">
                7 dias de workshops práticos, mentorias individuais e desafios diários de pitch.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={(e) => toggleBookmark("featured-1", "Semana Nacional da Oratória", e)}
                className={`h-7.5 rounded-full text-[11px] font-semibold backdrop-blur transition-all px-3 ${
                  markedIds.includes("featured-1")
                    ? "bg-amber-400 text-slate-900 font-bold hover:bg-amber-300"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Star className={`h-3 w-3 ${markedIds.includes("featured-1") ? "fill-slate-900" : ""}`} />
                {markedIds.includes("featured-1") ? "Marcado ⭐" : "Salvar"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Lista de Eventos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <span>Agenda de Eventos ({filteredEvents.length})</span>
              {selectedCat === "Marcados ⭐" && (
                <span className="text-xs text-amber-500 font-medium">(Exibindo eventos marcados por você)</span>
              )}
            </h3>
          </div>

          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full py-12 px-4 text-center rounded-3xl border border-dashed border-border bg-card/50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {selectedCat === "Marcados ⭐"
                    ? "Nenhum evento marcado ainda"
                    : "Nenhum evento encontrado"}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                  {selectedCat === "Marcados ⭐"
                    ? "Clique na estrela ou em 'Salvar Evento' nos cards para marcar seus eventos favoritos e acessá-los aqui rapidamente."
                    : "Tente alterar os termos de busca ou selecionar outra categoria acima."}
                </p>
                {selectedCat === "Marcados ⭐" && (
                  <Button
                    onClick={() => setSelectedCat("Todos")}
                    className="mt-4 rounded-2xl bg-gradient-brand text-white text-xs font-semibold px-5"
                  >
                    Ver Todos os Eventos
                  </Button>
                )}
              </div>
            ) : (
              filteredEvents.map((e) => {
                const isMarked = markedIds.includes(e.id);
                const isConfirmed = confirmedIds.includes(e.id);
                const isExpanded = expandedIds.includes(e.id);
                const effectiveConfirmed = e.confirmedCount + (isConfirmed ? 1 : 0);
                const occupancyPercent = Math.min(
                  100,
                  Math.round((effectiveConfirmed / e.maxCapacity) * 100)
                );

                return (
                  <Card
                    key={e.id}
                    className={`rounded-3xl p-5 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${
                      isMarked
                        ? "border-amber-500/50 dark:border-amber-400/40 bg-gradient-to-br from-amber-500/8 via-card to-primary/5 shadow-soft shadow-amber-500/10 ring-1 ring-amber-500/20"
                        : isConfirmed
                        ? "border-emerald-500/50 dark:border-emerald-400/40 bg-gradient-to-br from-emerald-500/8 via-card to-card shadow-soft ring-1 ring-emerald-500/20"
                        : "border-border hover:border-primary/30 hover:shadow-lg dark:hover:shadow-[0_12px_28px_-4px_rgba(255,255,255,0.15)]"
                    }`}
                  >
                    {/* Top Ribbon de Status para Marcado / Confirmado */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isMarked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500" /> Marcado
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Presença Confirmada
                          </span>
                        )}
                        {!isMarked && !isConfirmed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                            <Sparkles className="h-3 w-3 text-primary" /> {e.category}
                          </span>
                        )}
                      </div>

                      {/* Botão de Marcação rápida (Estrela / Bookmark) */}
                      <button
                        onClick={(evt) => toggleBookmark(e.id, e.title, evt)}
                        title={isMarked ? "Remover dos marcados" : "Marcar este evento"}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                          isMarked
                            ? "bg-amber-500 text-white shadow-soft scale-110"
                            : "bg-secondary/80 text-muted-foreground hover:bg-amber-500/20 hover:text-amber-500"
                        }`}
                      >
                        <Star className={`h-4 w-4 ${isMarked ? "fill-white" : ""}`} />
                      </button>
                    </div>

                    {/* Conteúdo Principal do Card */}
                    <Link
                      to={e.kind === "Online" ? "/events/online/$id" : "/events/offline/$id"}
                      params={{ id: e.id }}
                      className="block group-hover:opacity-95 transition-opacity"
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Data e Mês destacada */}
                        <div
                          className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl font-bold shadow-xs transition-transform group-hover:scale-105 ${
                            isMarked
                              ? "bg-gradient-brand text-white shadow-soft"
                              : "bg-gradient-soft text-primary"
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wider">
                            {e.date.split(",")[0]}
                          </span>
                          <span className="text-xl leading-none font-extrabold">
                            {e.date.split(" ")[1]}
                          </span>
                        </div>

                        {/* Detalhes do Evento */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <Badge
                              variant="secondary"
                              className={`rounded-full text-[10px] px-2.5 py-0.5 font-bold ${
                                e.kind === "Online"
                                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              {e.kind === "Online" ? (
                                <Video className="h-3 w-3 mr-1 inline" />
                              ) : (
                                <MapPin className="h-3 w-3 mr-1 inline" />
                              )}
                              {e.kind}
                            </Badge>
                            <Badge variant="outline" className="rounded-full text-[10px] px-2.5 py-0.5 font-semibold">
                              {e.category}
                            </Badge>
                          </div>

                          <h4 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {e.title}
                          </h4>

                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                            <span className="truncate">{e.place}</span>
                          </p>

                          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Clock className="h-3.5 w-3.5 text-primary/70" /> {e.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Descrição resumida */}
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {e.desc}
                      </p>
                    </Link>

                    {/* Informações dos Palestrantes / Convidados */}
                    {e.speakers && e.speakers.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex -space-x-2 overflow-hidden shrink-0">
                            {e.speakers.map((s, idx) => (
                              <div
                                key={idx}
                                title={`${s.name} - ${s.role}`}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white ring-2 ring-card shadow-xs"
                              >
                                {s.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            ))}
                          </div>
                          <span className="text-[11px] font-medium text-foreground truncate">
                            {e.speakers[0].name}
                            {e.speakers.length > 1 && ` +${e.speakers.length - 1}`}
                          </span>
                        </div>

                        <span className="text-[10px] text-muted-foreground bg-secondary/70 px-2 py-0.5 rounded-full shrink-0 font-medium">
                          Por: {e.organizer?.name || "Fale+"}
                        </span>
                      </div>
                    )}

                    {/* Barra de Ocupação & Capacidade */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span className="font-bold text-foreground">{effectiveConfirmed}</span> de{" "}
                          {e.maxCapacity} confirmados
                        </span>
                        <span
                          className={`font-bold ${
                            occupancyPercent >= 90
                              ? "text-rose-500"
                              : occupancyPercent >= 70
                              ? "text-amber-500"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {occupancyPercent}% vagas
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            occupancyPercent >= 90
                              ? "bg-rose-500"
                              : occupancyPercent >= 70
                              ? "bg-amber-500"
                              : "bg-gradient-brand"
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Menu de Ações Rápidas nos Cards */}
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {/* Botão de RSVP de 1 Clique */}
                        <Button
                          size="sm"
                          onClick={(evt) => toggleRSVP(e.id, e.title, evt)}
                          className={`h-8 rounded-xl text-xs font-semibold px-3 transition-all ${
                            isConfirmed
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft"
                              : "bg-gradient-brand hover:opacity-95 text-white shadow-soft"
                          }`}
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" />
                          {isConfirmed ? "Confirmado 🎉" : "Garantir Vaga"}
                        </Button>

                        {/* Botão de Compartilhar */}
                        <button
                          onClick={(evt) => handleShare(e.title, evt)}
                          title="Copiar link do evento"
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Botão de Bate-Papo com o Organizador */}
                        <Link
                          to="/events/chat/$id"
                          params={{ id: e.id }}
                          onClick={(evt) => evt.stopPropagation()}
                          title="Bate-papo com o Organizador"
                          className="flex h-8 items-center gap-1 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 px-2.5 text-xs font-bold transition-colors"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Chat</span>
                        </Link>
                      </div>

                      {/* Alternar Expansão de Detalhes da Agenda */}
                      <button
                        onClick={(evt) => toggleExpand(e.id, evt)}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <span>{isExpanded ? "Ocultar" : "Programação"}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    {/* Agenda Expandida Inline */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-border/80 space-y-3 bg-secondary/30 rounded-2xl p-3 text-xs animate-in fade-in-50 duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
                            Programação do Encontro
                          </span>
                          <span className="text-[10px] text-muted-foreground">{e.agenda?.length || 0} atividades</span>
                        </div>

                        {e.agenda && e.agenda.length > 0 ? (
                          <div className="space-y-2">
                            {e.agenda.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs">
                                <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono font-bold text-primary text-[10px] shrink-0">
                                  {item.time}
                                </span>
                                <span className="text-foreground/90 leading-tight">{item.activity}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-[11px]">Agenda detalhada disponível no link do evento.</p>
                        )}

                        <div className="pt-2 flex justify-end">
                          <Link
                            to={e.kind === "Online" ? "/events/online/$id" : "/events/offline/$id"}
                            params={{ id: e.id }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            Ver página completa do evento →
                          </Link>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

