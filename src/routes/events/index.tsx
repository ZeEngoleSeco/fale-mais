import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Plus, Users, Sparkles } from "lucide-react";
import { MOCK_EVENTS, type EventItem } from "@/data/mock-data";
import { useState, useMemo } from "react";


export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Eventos & Workshops — Fale+" }] }),
  component: EventsPage,
  
});

const cats = ["Todos", "Online", "Presencial", "Pitch", "Workshop", "Masterclass", "Meetup"];

function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todos");

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.desc.toLowerCase().includes(search.toLowerCase()) ||
        e.place.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        selectedCat === "Todos" ||
        e.kind === selectedCat ||
        e.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  return (
    <AppShell>
      <PageHeader
        title="Eventos & Workshops"
        subtitle="Encontros online e presenciais com a comunidade"
        action={
          <Link
            to="/events/create"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
            aria-label="Criar evento"
          >
            <Plus className="h-4 w-4" />
          </Link>
        }
      />
      <div className="px-5 space-y-4"> 
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, cidade ou categoria..."
            className="h-12 rounded-2xl pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedCat === c
                  ? "bg-gradient-brand text-white inset-shadow-sm soft-shadow"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Banner Destaque */}
        <Card className="overflow-hidden rounded-3xl border-0 p-0 bg-indigo-500 shadow-lg shadow-xl/30">
          <div className="bg-gradient-brand p-4 text-white">
            <div className="flex items-center gap-1.5 text-xs font-bold opacity-90">
              <Sparkles className="h-3.5 w-3.5" /> EM DESTAQUE
            </div>
            <h3 className="mt-2 text-xl font-extrabold leading-tight">Semana Nacional da Oratória Fale+</h3>
            <p className="mt-1 text-sm opacity-90">7 dias de workshops práticos, mentorias individuais e desafios ao vivo.</p>
            <div className="mt-4 flex items-center gap-3 text-xs opacity-90">
              <span className="rounded-full bg-white/20 px-3 py-1 font-semibold">15 a 22 de Fevereiro</span>
              <span>+400 inscritos</span>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3 shadow-xl">Agenda de Eventos ({filteredEvents.length})</h3>
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                <p className="text-sm">Nenhum evento encontrado para os filtros selecionados.</p>
              </div>
            ) : (
              filteredEvents.map((e) => (
                <Link
                  key={e.id}
                  to={e.kind === "Online" ? "/events/online/$id" : "/events/offline/$id"}
                  params={{ id: e.id }}
                  className="block"
                >
                  <Card className="rounded-3xl border-border p-4.5 transition hover:shadow-soft hover:-translate-y-0.5">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-soft text-primary font-bold">
                        <span className="text-[10px] font-semibold uppercase">{e.date.split(",")[0]}</span>
                        <span className="text-lg leading-none">{e.date.split(" ")[1]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-3">
                            {e.kind}
                          </Badge>
                          <Badge variant="outline" className="rounded-full text-[10px] px-2 py-3">
                            {e.category}
                          </Badge>
                        </div>
                        <p className="mt-1 truncate text-[15px] font-bold">{e.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{e.place}</span>
                        </p>
                        <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Calendar className="h-3 w-3" /> {e.time}
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Users className="h-3 w-3" /> {e.confirmedCount}/{e.maxCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
