import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Plus, Users } from "lucide-react";

export const Route = createFileRoute("/events/")({
  head: () => ({ meta: [{ title: "Eventos — Fala que eu te escuto+" }] }),
  component: EventsPage,
});

const cats = ["Todos", "Online", "Presencial", "Pitch", "Workshop"];

const events = [
  { id: "1", title: "Meetup: Falar em público sem medo", place: "São Paulo · SP", date: "Sáb, 15 Fev", time: "19h", people: 42, kind: "Presencial" },
  { id: "2", title: "Workshop online: Storytelling", place: "Online · Zoom", date: "Qua, 12 Fev", time: "20h", people: 128, kind: "Online" },
  { id: "3", title: "Pitch Night", place: "Rio de Janeiro · RJ", date: "Sex, 21 Fev", time: "19h30", people: 68, kind: "Presencial" },
];

function EventsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Eventos"
        subtitle="Encontre pessoas para praticar"
        action={
          <Link to="/events/create" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft">
            <Plus className="h-4 w-4" />
          </Link>
        }
      />
      <div className="px-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar eventos" className="h-12 rounded-2xl pl-10" />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {cats.map((c, i) => (
            <button
              key={c}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
                i === 0 ? "bg-gradient-brand text-white shadow-soft" : "bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <Card className="mt-4 overflow-hidden rounded-3xl border-0 p-0 shadow-lift">
          <div className="bg-gradient-brand p-5 text-white">
            <Badge className="rounded-full bg-white/20 text-white">Em destaque</Badge>
            <h3 className="mt-2 text-lg font-bold">Semana da Oratória Fala que eu te escuto+</h3>
            <p className="mt-1 text-sm opacity-90">7 dias de workshops, treinos e palestras.</p>
          </div>
        </Card>

        <h3 className="mt-6 mb-2 text-sm font-semibold text-muted-foreground">Próximos eventos</h3>
        <div className="space-y-3">
          {events.map((e) => (
            <Link
              key={e.id}
              to={e.kind === "Online" ? "/events/online/$id" : "/events/offline/$id"}
              params={{ id: e.id }}
              className="block"
            >
              <Card className="rounded-3xl border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-soft text-primary">
                    <span className="text-[10px] font-semibold uppercase">{e.date.split(",")[0]}</span>
                    <span className="text-lg font-bold leading-none">{e.date.split(" ")[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">{e.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {e.place}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.time}</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {e.people}</span>
                      <Badge variant="secondary" className="rounded-full text-[10px]">{e.kind}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
