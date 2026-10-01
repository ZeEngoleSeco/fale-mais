import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, Users, Lock, Globe, Trash2, Loader2, Radio } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  fetchAllRooms,
  deleteRoom,
  subscribeToRooms,
  type RoomDB,
} from "@/lib/supabase-room-store";
import { useCurrentUser } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo, useEffect } from "react";

export const Route = createFileRoute("/rooms/")({
  head: () => ({ meta: [{ title: "Salas de Prática — Solta Voz" }] }),
  component: RoomsPage,
});

const categories = ["Todas", "Pitch", "Improviso", "Corporativo", "Bem-estar", "Storytelling", "Debate"];

function RoomsPage() {
  const { user } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todas");
  const [roomsList, setRoomsList] = useState<RoomDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomDB | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Get the Supabase auth user ID for ownership checks
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data?.user?.id || null);
    });
  }, []);

  // Load rooms
  const loadRooms = async () => {
    setLoading(true);
    const rooms = await fetchAllRooms();
    setRoomsList(rooms);
    setLoading(false);
  };

  useEffect(() => {
    loadRooms();

    // Subscribe to realtime room changes
    const unsub = subscribeToRooms(() => {
      loadRooms();
    });

    return unsub;
  }, []);

  const filteredRooms = useMemo(() => {
    return roomsList.filter((room) => {
      const matchSearch =
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        (room.description || "").toLowerCase().includes(search.toLowerCase()) ||
        room.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "Todas" || room.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat, roomsList]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    const ok = await deleteRoom(deleteTarget.id);
    if (ok) {
      toast.success(`Sala "${deleteTarget.name}" excluída.`);
      setRoomsList((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } else {
      toast.error("Não foi possível excluir a sala.");
    }
    setDeleteTarget(null);
    setDeletingId(null);
  };

  return (
    <AppShell>
      <Toaster position="top-center" />
      <PageHeader
        title="Salas de Prática"
        subtitle="Pratique com outras pessoas em tempo real"
        action={
          user ? (
            <Link
              to="/rooms/create"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
              aria-label="Criar sala"
            >
              <Plus className="h-5 w-5" />
            </Link>
          ) : undefined
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
          {loading ? (
            <div className="col-span-full py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Radio className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">Nenhuma sala encontrada.</p>
              {(search || selectedCat !== "Todas") && (
                <button
                  onClick={() => { setSearch(""); setSelectedCat("Todas"); }}
                  className="mt-2 text-xs font-semibold text-primary hover:underline"
                >
                  Limpar filtros
                </button>
              )}
              {user && (
                <div className="mt-4">
                  <Link
                    to="/rooms/create"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-soft"
                  >
                    <Plus className="h-3.5 w-3.5" /> Criar a primeira sala
                  </Link>
                </div>
              )}
            </div>
          ) : (
            filteredRooms.map((r) => {
              const isOwner = currentUserId && r.host_id === currentUserId;
              const isDeleting = deletingId === r.id;

              return (
                <Card key={r.id} className="rounded-3xl border-border p-4.5 transition hover:shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {r.is_live && (
                          <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            AO VIVO
                          </span>
                        )}
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {r.category}
                        </Badge>
                        {r.is_private ? (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                        ) : (
                          <Globe className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                        )}
                      </div>

                      <p className="mt-2 truncate text-[15px] font-bold">{r.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>

                      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Users className="h-3.5 w-3.5 text-primary" /> {r.people_count}/{r.max_people}
                        </span>
                        <span className="text-[11px]">
                          Host: <strong className="text-foreground">{r.host_name}</strong>
                          {isOwner && (
                            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                              VOCÊ
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-2">
                    {/* Host avatar */}
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-soft text-[9px] font-bold text-primary ring-2 ring-background">
                      {r.host_initials}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      {isOwner && (
                        <button
                          onClick={() => setDeleteTarget(r)}
                          disabled={isDeleting}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
                          title="Excluir sala"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                      <Link
                        to="/rooms/$id"
                        params={{ id: r.id }}
                        className="rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:opacity-90"
                      >
                        Entrar na sala
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sala?</AlertDialogTitle>
            <AlertDialogDescription>
              A sala <strong>"{deleteTarget?.name}"</strong> será permanentemente excluída, incluindo
              todas as mensagens e participantes. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Excluir sala
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
