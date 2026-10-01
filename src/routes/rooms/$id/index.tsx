import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Mic,
  MicOff,
  Phone,
  MessageSquare,
  Users,
  Send,
  Loader2,
  Trash2,
  Volume2,
  VolumeX,
  Radio,
  Crown,
  UserPlus,
  X,
} from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  fetchRoomById,
  fetchRoomMessages,
  fetchRoomParticipants,
  sendRoomMessage,
  joinRoomParticipant,
  leaveRoomParticipant,
  deleteRoom,
  subscribeToRoomMessages,
  subscribeToRoomParticipants,
  subscribeToRoomDeletion,
  addParticipant,
  removeParticipant,
  type RoomDB,
  type RoomMessageDB,
  type RoomParticipantDB,
} from "@/lib/supabase-room-store";
import { voiceCallManager, type VoicePeer } from "@/lib/voice-call";
import { useCurrentUser } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/rooms/$id/")({
  head: () => ({ meta: [{ title: "Sala ao Vivo — Solta Voz" }] }),
  component: RoomPage,
});

function RoomPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const [room, setRoom] = useState<RoomDB | null>(null);
  const [messages, setMessages] = useState<RoomMessageDB[]>([]);
  const [participants, setParticipants] = useState<RoomParticipantDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgInput, setMsgInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Voice call state
  const [voicePeers, setVoicePeers] = useState<VoicePeer[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [myVolume, setMyVolume] = useState(0);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [inVoiceCall, setInVoiceCall] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Get supabase user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data?.user?.id || null);
    });
  }, []);

  // Load room data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [roomData, msgs, parts] = await Promise.all([
        fetchRoomById(id),
        fetchRoomMessages(id),
        fetchRoomParticipants(id),
      ]);
      setRoom(roomData);
      setMessages(msgs);
      setParticipants(parts);
      setLoading(false);
    };
    load();
  }, [id]);

  // Join room as participant when loaded
  useEffect(() => {
    if (!loading && user) {
      const isHost = room && currentUserId && room.host_id === currentUserId;
      joinRoomParticipant(id, isHost ? "Host" : "Ouvinte");
    }
  }, [loading, user, id, room, currentUserId]);

  // Subscribe to realtime messages
  useEffect(() => {
    const unsub = subscribeToRoomMessages(id, (newMsg) => {
      setMessages((prev) => {
        // Avoid duplicate if we already have this message (from optimistic update)
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
    return unsub;
  }, [id]);

  // Subscribe to realtime participants
  useEffect(() => {
    const unsub = subscribeToRoomParticipants(id, (parts) => {
      setParticipants(parts);
    });
    return unsub;
  }, [id]);

  // Subscribe to room deletion
  useEffect(() => {
    const unsub = subscribeToRoomDeletion(id, () => {
      toast.info("Esta sala foi encerrada pelo criador.");
      voiceCallManager.leaveRoomVoice();
      navigate({ to: "/rooms" });
    });
    return unsub;
  }, [id, navigate]);

  // Subscribe to voice call state
  useEffect(() => {
    const unsub = voiceCallManager.subscribe((peers, micActive, vol) => {
      setVoicePeers(peers);
      setIsMicActive(micActive);
      setMyVolume(vol);
    });
    return () => {
      unsub();
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Leave room on unmount
  useEffect(() => {
    return () => {
      leaveRoomParticipant(id);
      voiceCallManager.leaveRoomVoice();
    };
  }, [id]);

  const handleSendMessage = async () => {
    if (!msgInput.trim() || !user) return;
    setSending(true);
    const text = msgInput.trim();
    setMsgInput("");
    await sendRoomMessage(id, text);
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleJoinVoice = async () => {
    if (inVoiceCall) {
      voiceCallManager.leaveRoomVoice();
      setInVoiceCall(false);
      toast.info("Você saiu da chamada de voz.");
      return;
    }
    setVoiceLoading(true);
    const ok = await voiceCallManager.joinRoomVoice(id, user ?? undefined);
    setVoiceLoading(false);
    if (ok) {
      setInVoiceCall(true);
      toast.success("Entrou na chamada de voz! 🎙️");
    } else {
      toast.error("Não foi possível entrar na chamada.");
    }
  };

  const handleToggleMic = async () => {
    setVoiceLoading(true);
    await voiceCallManager.toggleMicrophone();
    setVoiceLoading(false);
  };

  const handleLeave = async () => {
    await leaveRoomParticipant(id);
    voiceCallManager.leaveRoomVoice();
    navigate({ to: "/rooms" });
  };

  const handleDeleteRoom = async () => {
    const ok = await deleteRoom(id);
    if (ok) {
      toast.success("Sala excluída.");
      navigate({ to: "/rooms" });
    } else {
      toast.error("Não foi possível excluir a sala.");
    }
    setShowDeleteDialog(false);
  };

  const handleAddParticipant = async (selectedUser: any) => {
    await addParticipant(id, {
      id: selectedUser.id,
      name: selectedUser.name,
      initials: selectedUser.initials,
    });
    setIsAddOpen(false);
    toast.success("Participante adicionado.");
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (confirm("Remover participante?")) {
      await removeParticipant(id, participantId);
      toast.success("Participante removido.");
    }
  };

  const { allUsers } = useCurrentUser();
  const filteredUsers = allUsers.filter(u => 
    !participants.find(p => p.user_id === u.id) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isOwner = currentUserId && room && room.host_id === currentUserId;

  if (loading) {
    return (
      <AppShell hideNav>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!room) {
    return (
      <AppShell hideNav>
        <PageHeader title="Sala não encontrada" back="/rooms" />
        <div className="px-5 py-12 text-center text-muted-foreground">
          <p className="text-sm">Esta sala não existe ou foi excluída.</p>
          <Button onClick={() => navigate({ to: "/rooms" })} className="mt-4">
            Ver salas
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideNav>
      <Toaster position="top-center" />

      <PageHeader
        title={room.name}
        subtitle={`Ao vivo · ${participants.length} participante${participants.length !== 1 ? "s" : ""}`}
        back="/rooms"
        action={
          isOwner ? (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 transition"
              title="Excluir sala"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : undefined
        }
      />

      <div className="px-5 space-y-4 pb-36">

        {/* Room info banner */}
        <Card className="rounded-3xl border-0 bg-gradient-brand p-5 text-white shadow-lift">
          <div className="flex items-center justify-between text-xs opacity-90">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              AO VIVO
            </span>
            <Badge className="bg-white/20 text-white text-[10px] border-0">
              {room.category}
            </Badge>
          </div>

          <div className="mt-3">
            <p className="text-lg font-bold leading-tight">{room.name}</p>
            {room.description && (
              <p className="mt-1 text-xs opacity-80 line-clamp-2">{room.description}</p>
            )}
            {room.initial_topic && (
              <p className="mt-2 text-xs opacity-90 font-medium">📌 {room.initial_topic}</p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs opacity-90">
            <Crown className="h-3.5 w-3.5" />
            <span>Host: <strong>{room.host_name}</strong></span>
          </div>
        </Card>

        {/* Voice Call Section */}
        <Card className="rounded-3xl border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Radio className="h-4 w-4 text-primary" />
              Chamada de Voz
              {inVoiceCall && (
                <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-full px-2 py-0.5">
                  Conectado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {inVoiceCall && (
                <button
                  onClick={handleToggleMic}
                  disabled={voiceLoading}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                    isMicActive
                      ? "bg-primary text-white shadow-soft"
                      : "bg-secondary text-foreground"
                  }`}
                  title={isMicActive ? "Mutar microfone" : "Ativar microfone"}
                >
                  {voiceLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isMicActive ? (
                    <Mic className="h-3.5 w-3.5" />
                  ) : (
                    <MicOff className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
              <button
                onClick={handleJoinVoice}
                disabled={voiceLoading}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  inVoiceCall
                    ? "bg-destructive text-white hover:bg-destructive/90"
                    : "bg-gradient-brand text-white hover:opacity-90 shadow-soft"
                }`}
              >
                {voiceLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin inline" />
                ) : inVoiceCall ? (
                  "Sair da voz"
                ) : (
                  "Entrar na voz"
                )}
              </button>
            </div>
          </div>

          {inVoiceCall && (
            <div className="space-y-2">
              {/* My voice indicator */}
              <VoiceUserBubble
                name={user?.name || "Você"}
                initials={user?.initials || "?"}
                isMuted={!isMicActive}
                isSpeaking={myVolume > 12}
                volume={myVolume}
                isMe
              />
              {/* Other voice peers */}
              {voicePeers.map((peer) => (
                <VoiceUserBubble
                  key={peer.id}
                  name={peer.name}
                  initials={peer.initials}
                  isMuted={peer.isMuted}
                  isSpeaking={peer.isSpeaking}
                  volume={peer.volume}
                />
              ))}
              {voicePeers.length === 0 && (
                <p className="text-[11px] text-muted-foreground text-center py-2">
                  Nenhum outro participante na voz ainda. Convide alguém!
                </p>
              )}
            </div>
          )}

          {!inVoiceCall && (
            <p className="text-xs text-muted-foreground text-center py-1">
              Entre na chamada para conversar com os participantes da sala.
            </p>
          )}
        </Card>

        {/* Participants */}
        <Card className="rounded-3xl border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Users className="h-4 w-4 text-primary" />
              Participantes ({participants.length})
            </div>
            
            {isOwner && (
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs bg-secondary text-primary hover:bg-secondary/80">
                    <UserPlus className="h-3 w-3 mr-1.5" /> Adicionar
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
                    <div className="max-h-[300px] overflow-y-auto space-y-2 minimal-scrollbar">
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
                            <Button size="sm" variant="secondary" onClick={() => handleAddParticipant(u)}>
                              Adicionar
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className="group flex items-center gap-1.5 rounded-full bg-secondary pl-1.5 pr-2.5 py-1 text-xs font-medium"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-soft text-[9px] font-bold text-primary">
                  {p.user_initials}
                </div>
                <span className="text-foreground">{p.user_name.split(" ")[0]}</span>
                {p.role === "Host" && (
                  <Crown className="h-3 w-3 text-amber-500" />
                )}
                {isOwner && p.user_id !== currentUserId && (
                  <button 
                    onClick={() => handleRemoveParticipant(p.user_id)}
                    className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive/10 text-destructive opacity-0 transition-opacity hover:bg-destructive hover:text-white group-hover:opacity-100"
                    title="Remover"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhum participante ainda.</p>
            )}
          </div>
        </Card>

        {/* Chat */}
        <Card className="rounded-3xl border-border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold">
              <MessageSquare className="h-4 w-4 text-primary" /> Chat da Sala
            </div>
            <span className="text-[10px] text-muted-foreground">Tempo real</span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1.5 minimal-scrollbar">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Nenhuma mensagem ainda. Seja o primeiro a falar! 👋
              </p>
            )}
            {messages.map((msg) => {
              const isMe = currentUserId && msg.sender_id === currentUserId;
              return (
                <ChatLine
                  key={msg.id}
                  name={msg.sender_name}
                  initials={msg.sender_initials}
                  text={msg.text}
                  time={new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  mine={!!isMe}
                />
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {user ? (
            <div className="mt-3 flex items-center gap-2">
              <Input
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Envie uma mensagem..."
                className="h-10 rounded-2xl"
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !msgInput.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          ) : (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Faça login para participar do chat.
            </p>
          )}
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="flex justify-around gap-2 rounded-3xl border border-border/80 bg-card/95 p-3 shadow-lift backdrop-blur-xl">
          {/* Mic toggle (only if in voice) */}
          {inVoiceCall && (
            <CtrlBtn
              active={isMicActive}
              onClick={handleToggleMic}
              label={isMicActive ? "Microfone" : "Mudo"}
            >
              {isMicActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </CtrlBtn>
          )}

          {/* Voice call toggle */}
          <CtrlBtn
            active={inVoiceCall}
            onClick={handleJoinVoice}
            label={inVoiceCall ? "Na voz" : "Voz"}
          >
            {inVoiceCall ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </CtrlBtn>

          {/* Participants count */}
          <button 
            className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
            onClick={() => navigate({ to: `/rooms/${id}/participants` })}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary relative transition-colors hover:bg-secondary/80">
              <Users className="h-5 w-5" />
              {participants.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white shadow-sm">
                  {participants.length}
                </span>
              )}
            </span>
            Pessoas
          </button>

          {/* Leave room */}
          <CtrlBtn destructive onClick={handleLeave} label="Sair">
            <Phone className="h-5 w-5 rotate-[135deg]" />
          </CtrlBtn>
        </div>
      </div>

      {/* Delete room dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sala?</AlertDialogTitle>
            <AlertDialogDescription>
              A sala <strong>"{room.name}"</strong> e todas as suas mensagens serão excluídas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function VoiceUserBubble({
  name,
  initials,
  isMuted,
  isSpeaking,
  volume,
  isMe,
}: {
  name: string;
  initials: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number;
  isMe?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl px-3 py-2 transition-all ${
        isSpeaking
          ? "bg-emerald-500/10 border border-emerald-500/30"
          : "bg-secondary"
      }`}
    >
      <div
        className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-all ${
          isSpeaking ? "bg-emerald-500 scale-110 shadow-lg" : "bg-gradient-brand"
        }`}
      >
        {initials}
        {isSpeaking && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">
          {name} {isMe && <span className="text-muted-foreground font-normal">(você)</span>}
        </p>
        {/* Volume bar */}
        {!isMuted && volume > 0 && (
          <div className="mt-1 h-1 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-100"
              style={{ width: `${Math.min(100, volume)}%` }}
            />
          </div>
        )}
      </div>
      {isMuted ? (
        <MicOff className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      ) : (
        <Mic className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      )}
    </div>
  );
}

function ChatLine({
  name,
  initials,
  text,
  time,
  mine,
}: {
  name: string;
  initials: string;
  text: string;
  time: string;
  mine?: boolean;
}) {
  return (
    <div className={`flex gap-2 ${mine ? "flex-row-reverse" : "flex-row"}`}>
      {!mine && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-soft text-[9px] font-bold text-primary mt-0.5">
          {initials}
        </div>
      )}
      <div className={`flex flex-col max-w-[80%] ${mine ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
          {!mine && <span className="font-semibold">{name}</span>}
          <span>{time}</span>
        </div>
        <div
          className={`mt-0.5 rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
            mine
              ? "bg-gradient-brand text-white rounded-br-xs"
              : "bg-secondary text-foreground rounded-tl-xs"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({
  children,
  label,
  active,
  destructive,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
          destructive
            ? "bg-destructive text-white"
            : active
            ? "bg-gradient-brand text-white shadow-soft"
            : "bg-secondary"
        }`}
      >
        {children}
      </span>
      {label}
    </button>
  );
}
