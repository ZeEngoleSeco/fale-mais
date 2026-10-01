import { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserPlus, Trash2, Crown, Loader2 } from "lucide-react";
import { 
  fetchRoomById, 
  fetchRoomParticipants, 
  subscribeToRoomParticipants,
  removeParticipant,
  addParticipant,
  leaveRoomParticipant,
  fetchAvailableProfiles,
  RoomDB, 
  RoomParticipantDB 
} from "@/lib/supabase-room-store";
import { useCurrentUser } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/rooms/$id/participants")({
  head: () => ({ meta: [{ title: "Participantes — Solta Voz" }] }),
  component: Participants,
});

interface AvailableUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor?: string;
}

function Participants() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, allUsers } = useCurrentUser();
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomDB | null>(null);
  const [participants, setParticipants] = useState<RoomParticipantDB[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const kickedRef = useRef(false);

  const handleKicked = async () => {
    if (kickedRef.current) return;
    kickedRef.current = true;
    try {
      await leaveRoomParticipant(id);
    } catch {}
    toast.error("Você foi removido dessa sala.", {
      duration: 6000,
    });
    navigate({ to: "/rooms" });
  };

  // Get supabase auth ID & check removal
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data?.user?.id || null;
      setCurrentUserId(uid);
      if (uid) {
        const removed = await isUserRemovedFromRoom(id, uid);
        if (removed) {
          handleKicked();
        }
      }
    });
  }, [id]);

  // Load room, participants and real profiles
  useEffect(() => {
    async function loadData() {
      const [roomData, initialParticipants, realProfiles] = await Promise.all([
        fetchRoomById(id),
        fetchRoomParticipants(id),
        fetchAvailableProfiles(),
      ]);

      if (!roomData) {
        navigate({ to: "/rooms" });
        return;
      }
      setRoom(roomData);
      setParticipants(initialParticipants);

      // Merge real profiles from Supabase with local allUsers fallback
      const profilesMap = new Map<string, AvailableUser>();
      for (const p of realProfiles) {
        profilesMap.set(p.id, p);
      }
      for (const u of allUsers) {
        if (!profilesMap.has(u.id) && !Array.from(profilesMap.values()).some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
          profilesMap.set(u.id, {
            id: u.id,
            name: u.name,
            email: u.email,
            initials: u.initials,
            avatarColor: u.avatarColor,
          });
        }
      }
      setAvailableUsers(Array.from(profilesMap.values()));
      setLoading(false);
    }
    loadData();

    // Realtime subscription — INSERT on room_removals triggers onUserRemoved
    // for the kicked user only (ID compared here on the client side)
    const unsub = subscribeToRoomParticipants(
      id,
      (newParticipants) => {
        setParticipants(newParticipants);
      },
      (removedUserId) => {
        // Only show the removal message to the user who was actually removed
        if (currentUserId && removedUserId === currentUserId) {
          handleKicked();
        }
      }
    );

    return () => unsub();
  }, [id, allUsers, currentUserId]);

  const isHost = (currentUserId && room?.host_id === currentUserId) || (user?.id && room?.host_id === user.id);

  const handleRemove = async (participantId: string, participantName: string, rowId?: string) => {
    if (confirm(`Tem certeza que deseja remover ${participantName} desta sala?`)) {
      setParticipants((prev) => prev.filter((p) => p.user_id !== participantId && p.id !== rowId));
      toast.success(`${participantName} foi removido da sala.`);
      await removeParticipant(id, participantId, rowId);
    }
  };

  const handleAdd = async (selectedUser: AvailableUser) => {
    setAddingId(selectedUser.id);
    const ok = await addParticipant(id, {
      id: selectedUser.id,
      name: selectedUser.name,
      initials: selectedUser.initials,
    });
    setAddingId(null);
    if (ok) {
      toast.success(`${selectedUser.name} adicionado com sucesso!`);
      setIsAddOpen(false);
    } else {
      toast.error("Erro ao adicionar participante. Verifique se o usuário é válido.");
    }
  };

  const filteredUsers = availableUsers.filter((u) => 
    !participants.find((p) => p.user_id === u.id) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading || !room) {
    return (
      <AppShell>
        <PageHeader title="Participantes" subtitle="Carregando..." back={`/rooms/${id}`} />
        <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Toaster position="top-center" />
      <PageHeader
        title="Participantes"
        subtitle={`${room.name} (${participants.length})`}
        back={`/rooms/${id}`}
        action={
          isHost && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary text-primary">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Participante</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input 
                    placeholder="Buscar por nome ou email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 rounded-xl"
                  />
                  <div className="max-h-[300px] overflow-y-auto space-y-2 minimal-scrollbar pr-1">
                    {filteredUsers.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">Nenhum usuário disponível para adicionar.</p>
                    ) : (
                      filteredUsers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-2.5 rounded-2xl border border-border bg-card">
                          <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${u.avatarColor || 'from-blue-500 to-cyan-500'} text-xs font-bold text-white shadow-xs`}>
                              {u.initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            disabled={addingId === u.id}
                            className="rounded-xl bg-gradient-brand text-white shadow-soft shrink-0" 
                            onClick={() => handleAdd(u)}
                          >
                            {addingId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Adicionar"}
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )
        }
      />
      <div className="px-5 space-y-2.5 pb-16">
        {participants.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">Nenhum participante na sala.</p>
        )}
        {participants.map((p) => {
          const isCurrentUser = (currentUserId && p.user_id === currentUserId) || (user?.id && p.user_id === user.id);
          return (
            <Card key={p.id} className="flex items-center gap-3 rounded-2xl border-border p-3.5 shadow-xs">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-soft text-sm font-bold text-primary">
                {p.user_initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-foreground">
                    {p.user_name}
                    {isCurrentUser && <span className="text-xs text-muted-foreground font-normal ml-1">(você)</span>}
                  </p>
                  {p.role === "Host" && <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={p.role === "Host" ? "default" : p.role === "Orador" ? "secondary" : "outline"}
                    className="rounded-full text-[10px] px-2 py-0"
                  >
                    {p.role}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </span>
                </div>
              </div>
              
              {isHost && !isCurrentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl shadow-lift">
                    <DropdownMenuItem 
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl font-medium"
                      onClick={() => handleRemove(p.user_id, p.user_name, p.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover da sala
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
