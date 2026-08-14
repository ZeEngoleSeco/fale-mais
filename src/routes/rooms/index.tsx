import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, Users, Lock, Globe, Radio } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_ROOMS, type RoomItem } from "@/data/mock-data";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/rooms/")({
  head: () => ({ meta: [{ title: "Salas de Prática — Fale+" }] }),
  component: RoomsPage,
});

const categories = ["Todas", "Pitch", "Improviso", "Corporativo", "Bem-estar", "Storytelling", "Debate"];

function RoomsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todas");

  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter((room) => {
      const matchSearch =
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.desc.toLowerCase().includes(search.toLowerCase()) ||
        room.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "Todas" || room.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  return (
    <AppShell>
      <PageHeader
        title="Salas de Prática"
        subtitle="Pratique com outras pessoas em tempo real"
        action={
          <Link
            to="/rooms/create"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
            aria-label="Criar sala"
          >
            <Plus className="h-5 w-5" />
          </Link>
        }
      />
      <div className="px-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, tema ou categoria..."
              className="h-12 rounded-2xl pl-10"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCat === c
                  ? "bg-gradient-brand text-white shadow-soft"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 xl:grid-cols-3">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <p className="text-sm">Nenhuma sala encontrada para os filtros selecionados.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCat("Todas");
                }}
                className="mt-2 text-xs font-semibold text-primary hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredRooms.map((r) => (
              <Card key={r.id} className="rounded-3xl border-border p-4.5 transition hover:shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {r.isLive && (
                        <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          AO VIVO
                        </span>
                      )}
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {r.category}
                      </Badge>
                      {r.isPrivate ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                      ) : (
                        <Globe className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                      )}
                    </div>

                    <p className="mt-2 truncate text-[15px] font-bold">{r.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.desc}</p>

                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Users className="h-3.5 w-3.5 text-primary" /> {r.peopleCount}/{r.maxPeople}
                      </span>
                      <span className="text-[11px]">
                        Host: <strong className="text-foreground">{r.host.name}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {r.participants.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-soft text-[9px] font-bold text-primary ring-2 ring-background"
                      >
                        {p.initials}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/rooms/$id"
                    params={{ id: r.id }}
                    className="rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:opacity-90"
                  >
                    Entrar na sala
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
