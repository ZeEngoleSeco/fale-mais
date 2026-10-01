import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, Plus, Users, Lock, Globe, Trash2, Loader2, Radio, Eye, EyeOff, KeyRound } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  fetchAllRooms,
  deleteRoom,
  subscribeToRooms,
  verifyRoomPassword,
  type RoomDB,
} from "@/lib/supabase-room-store";
import { useCurrentUser } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo, useEffect, useRef } from "react";

export const Route = createFileRoute("/rooms/")({
  head: () => ({ meta: [{ title: "Salas de Prática — Solta Voz" }] }),
  component: RoomsPage,
});

const categories = ["Todas", "Pitch", "Improviso", "Corporativo", "Bem-estar", "Storytelling", "Debate"];

function RoomsPage() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todas");
  const [roomsList, setRoomsList] = useState<RoomDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomDB | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Password modal state
  const [passwordRoom, setPasswordRoom] = useState<RoomDB | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data?.user?.id || null);
    });
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    const rooms = await fetchAllRooms();
    setRoomsList(rooms);
    setLoading(false);
  };

  useEffect(() => {
    loadRooms();
    const unsub = subscribeToRooms(() => { loadRooms(); });
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

  /** Called when user clicks "Entrar na sala" */
  const handleEnterRoom = (room: RoomDB) => {
    // Owner always enters directly, no password needed
    if (currentUserId && room.host_id === currentUserId) {
      navigate({ to: "/rooms/$id", params: { id: room.id } });
      return;
    }

    if (room.is_private) {
      setPasswordRoom(room);
      setPasswordInput("");
      setPasswordError("");
      setShowPassword(false);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      navigate({ to: "/rooms/$id", params: { id: room.id } });
    }
  };

  /** Validate password via SECURITY DEFINER RPC — hash never leaves the DB */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordRoom || !passwordInput.trim()) {
      setPasswordError("Digite a senha para continuar.");
      return;
    }

    setVerifying(true);
    setPasswordError("");

    const result = await verifyRoomPassword(passwordRoom.id, passwordInput.trim());
    setVerifying(false);

    if (result === "ok" || result === "not_private") {
      setPasswordRoom(null);
      navigate({ to: "/rooms/$id", params: { id: passwordRoom.id } });
    } else if (result === "wrong_password") {
      setPasswordError("Senha incorreta. Tente novamente.");
      setPasswordInput("");
      setTimeout(() => passwordInputRef.current?.focus(), 50);
    } else if (result === "not_found") {
      setPasswordError("Sala não encontrada.");
    } else {
      setPasswordError("Erro ao verificar a senha. Tente novamente.");
    }
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
                          <Lock className="h-3.5 w-3.5 text-amber-500 ml-auto" title="Sala privada — requer senha" />
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
                      <button
                        onClick={() => handleEnterRoom(r)}
                        className="rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:opacity-90 inline-flex items-center gap-1.5"
                      >
                        {r.is_private && !isOwner && <Lock className="h-3 w-3" />}
                        Entrar na sala
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* ── Password Modal ─────────────────────────────────────── */}
      <Dialog
        open={!!passwordRoom}
        onOpenChange={(open) => { if (!open) setPasswordRoom(null); }}
      >
        <DialogContent className="sm:max-w-[400px] rounded-3xl">
          <DialogHeader className="text-left">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
              <KeyRound className="h-6 w-6 text-amber-500" />
            </div>
            <DialogTitle className="text-lg font-bold">Sala Privada</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{passwordRoom?.name}</span>{" "}
              requer uma senha para entrar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
            <div className="relative">
              <Input
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Digite a senha da sala..."
                className={`h-12 rounded-2xl pr-11 ${
                  passwordError ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
                disabled={verifying}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-xs font-semibold text-destructive flex items-center gap-1.5 animate-in slide-in-from-top-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                {passwordError}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setPasswordRoom(null)}
                disabled={verifying}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={verifying || !passwordInput.trim()}
                className="flex-1 rounded-2xl bg-gradient-brand text-white font-semibold shadow-soft"
              >
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
