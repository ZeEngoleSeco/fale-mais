import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, Users, Lock, Globe } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/rooms/")({
  head: () => ({ meta: [{ title: "Salas — Fale+" }] }),
  component: RoomsPage,
});

const rooms = [
  { id: "1", name: "Pitch para investidores", desc: "Prática semanal de pitchs curtos", people: 12, priv: false, cat: "Pitch" },
  { id: "2", name: "Vencendo a ansiedade", desc: "Grupo de apoio e exercícios guiados", people: 28, priv: false, cat: "Bem-estar" },
  { id: "3", name: "Sala fechada — Time Alpha", desc: "Prática interna", people: 6, priv: true, cat: "Corporativo" },
  { id: "4", name: "Improviso livre", desc: "Temas surpresa em 60s", people: 19, priv: false, cat: "Improviso" },
];

function RoomsPage() {
  return (
    <AppShell>
      <PageHeader title="Salas" subtitle="Pratique com outras pessoas" />
      <div className="px-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar salas" className="h-12 rounded-2xl pl-10" />
          </div>
          <Link
            to="/rooms/create"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
            aria-label="Criar sala"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
          {["Todas", "Pitch", "Improviso", "Corporativo", "Bem-estar"].map((c, i) => (
            <button
              key={c}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
                i === 0 ? "bg-gradient-brand text-white shadow-soft" : "bg-secondary text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {rooms.map((r) => (
            <Card key={r.id} className="rounded-3xl border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold">{r.name}</p>
                    {r.priv ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{r.desc}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {r.people}
                    </span>
                    <Badge variant="secondary" className="rounded-full text-[10px]">{r.cat}</Badge>
                  </div>
                </div>
                <Link
                  to="/rooms/$id"
                  params={{ id: r.id }}
                  className="shrink-0 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-soft"
                >
                  Entrar
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
