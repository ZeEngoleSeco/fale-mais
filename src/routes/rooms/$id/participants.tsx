import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, UserPlus, Trash2 } from "lucide-react";
import { 
  fetchRoomById, 
  fetchRoomParticipants, 
  subscribeToRoomParticipants,
  removeParticipant,
  addParticipant,
  RoomDB, 
  RoomParticipantDB 
} from "@/lib/supabase-room-store";
import { useCurrentUser } from "@/lib/user-store";
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

function Participants() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, allUsers } = useCurrentUser();
  
  const [room, setRoom] = useState<RoomDB | null>(null);
  const [participants, setParticipants] = useState<RoomParticipantDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHost = room?.host_id === user.id;

  useEffect(() => {
    async function loadData() {
      const roomData = await fetchRoomById(id);
      if (!roomData) {
        navigate({ to: "/rooms" });
        return;
      }
      setRoom(roomData);

      const initialParticipants = await fetchRoomParticipants(id);
      setParticipants(initialParticipants);
      setLoading(false);
    }
    loadData();

    const unsub = subscribeToRoomParticipants(id, (newParticipants) => {
      setParticipants(newParticipants);
    });

    return () => unsub();
  }, [id, navigate]);

  const handleRemove = async (participantId: string) => {
    if (confirm("Tem certeza que deseja remover este participante?")) {
      await removeParticipant(id, participantId);
    }
  };

  const handleAdd = async (selectedUser: any) => {
    await addParticipant(id, {
      id: selectedUser.id,
      name: selectedUser.name,
      initials: selectedUser.initials,
    });
    setIsAddOpen(false);
  };

  const filteredUsers = allUsers.filter(u => 
    !participants.find(p => p.user_id === u.id) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading || !room) {
    return (
      <AppShell>
        <PageHeader title="Participantes" subtitle="Carregando..." back={`/rooms/${id}`} />
        <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
          Carregando...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
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
                    className="mb-4"
                  />
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {filteredUsers.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
                    ) : (
                      filteredUsers.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-2 rounded-xl border border-border">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${u.avatarColor || 'from-blue-500 to-cyan-500'} text-sm font-bold text-white`}>
                              {u.initials}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="secondary" onClick={() => handleAdd(u)}>
                            Adicionar
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
      <div className="px-5 space-y-2 pb-10">
        {participants.map((p) => (
          <Card key={p.id} className="flex items-center gap-3 rounded-2xl border-border p-3.5 shadow-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-soft text-sm font-bold text-primary">
              {p.user_initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-foreground">{p.user_name}</p>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant={p.role === "Host" ? "default" : p.role === "Orador" ? "secondary" : "outline"}
                  className="rounded-full text-[10px] px-2 py-0"
                >
                  {p.role}
                </Badge>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                </span>
              </div>
            </div>
            
            {isHost && p.user_id !== user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl"
                    onClick={() => handleRemove(p.user_id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover da sala
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
