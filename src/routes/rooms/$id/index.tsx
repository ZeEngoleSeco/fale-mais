import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mic, MicOff, Video, Hand, Phone, MessageSquare, Timer, Settings, Users, Send, Star, Sparkles, ThumbsUp, Heart } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_ROOMS, CURRENT_USER } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/rooms/$id/")({
  head: () => ({ meta: [{ title: "Sala ao Vivo — Fale+" }] }),
  component: RoomPage,
});

function RoomPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const room = MOCK_ROOMS.find((r) => r.id === id) || MOCK_ROOMS[0];

  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [hand, setHand] = useState(false);
  const [starRating, setStarRating] = useState<number | null>(null);
  const [ratingSaved, setRatingSaved] = useState(false);

  const [chatMessages, setChatMessages] = useState(
    room.recentMessages.length > 0
      ? room.recentMessages
      : [
          { id: "m1", sender: "Marina Alves", text: "Excelente gancho inicial na proposta de valor! 🚀", time: "Agora" },
          { id: "m2", sender: "Lucas Duarte", text: "A dicção ficou super clara, parabéns!", time: "Há 1 min" },
        ]
  );
  const [msgInput, setMsgInput] = useState("");

  const handleSendMessage = () => {
    if (!msgInput.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "Você",
      text: msgInput.trim(),
      time: "Agora",
      isMe: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setMsgInput("");

    // Simulate mock reply after 1.5s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-rep-${Date.now()}`,
          sender: "Carlos Eduardo (Mentor)",
          text: "Muito bom ponto! Atenção especial ao fechamento da fala.",
          time: "Agora",
        },
      ]);
    }, 1500);
  };

  const handleRate = (rating: number) => {
    setStarRating(rating);
    setRatingSaved(true);
    setTimeout(() => setRatingSaved(false), 3000);
  };

  const currentSpeaker = room.currentSpeaker || {
    name: "João Ribeiro",
    initials: "JR",
    topic: "Pitch de Solução SaaS B2B · Turno 3",
    turn: 3,
    timeRemaining: "01:45",
  };

  return (
    <AppShell hideNav>
      <PageHeader
        title={room.name}
        subtitle={`Ao vivo · ${room.peopleCount} participantes`}
        back="/rooms"
        action={
          <Link
            to="/rooms/$id/settings"
            params={{ id }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card hover:bg-secondary"
          >
            <Settings className="h-4 w-4" />
          </Link>
        }
      />
      <div className="px-5 space-y-4 pb-36">
        {/* Palco Principal / Orador */}
        <Card className="rounded-3xl border-0 bg-gradient-brand p-5 text-white shadow-lift">
          <div className="flex items-center justify-between text-xs opacity-90">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              NO PALCO AGORA
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 font-bold">
              <Timer className="h-3.5 w-3.5" /> {currentSpeaker.timeRemaining}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold backdrop-blur shadow-inner">
              {currentSpeaker.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-tight">{currentSpeaker.name}</p>
              <p className="mt-0.5 text-xs opacity-90 truncate">{currentSpeaker.topic}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHand(!hand)}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow hover:bg-white/90 transition"
            >
              {hand ? "✋ Mão Levantada (Na fila)" : "✋ Pedir a palavra"}
            </button>
            <Link
              to="/rooms/$id/overview"
              params={{ id }}
              className="rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/25 transition"
            >
              Visão geral da sala
            </Link>
          </div>
        </Card>

        {/* Participantes em Destaque */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="font-semibold">Participantes na sala ({room.participants.length})</span>
            <Link to="/rooms/$id/participants" params={{ id }} className="text-primary font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {room.participants.slice(0, 4).map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-2 text-center shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-soft text-xs font-bold text-primary">
                  {p.initials}
                </div>
                <p className="truncate w-full text-[11px] font-semibold">{p.name.split(" ")[0]}</p>
                <span className="text-[9px] text-muted-foreground">{p.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat da Sala */}
        <Card className="rounded-3xl border-border p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold">
              <MessageSquare className="h-4 w-4 text-primary" /> Chat da Sala
            </div>
            <span className="text-[10px] text-muted-foreground">Mensagens em tempo real</span>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {chatMessages.map((msg) => (
              <ChatLine key={msg.id} name={msg.sender} text={msg.text} time={msg.time} mine={msg.isMe} />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Envie seu feedback ou aplauso..."
              className="h-10 rounded-2xl"
            />
            <button
              onClick={handleSendMessage}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Card>

        {/* Avaliação Rápida */}
        <Card className="rounded-3xl border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Avaliar apresentação</p>
              <p className="text-xs text-muted-foreground">Dê sua nota de 1 a 5 estrelas para {currentSpeaker.name}</p>
            </div>
            {ratingSaved && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                Salvo! ✨
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                className="p-1 text-2xl transition hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`h-7 w-7 ${
                    starRating && star <= starRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            {starRating && (
              <span className="ml-2 text-sm font-bold text-primary">{starRating}.0</span>
            )}
          </div>
        </Card>
      </div>

      {/* Barra de Controles Inferior */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="flex justify-around gap-2 rounded-3xl border border-border/80 bg-card/95 p-3 shadow-lift backdrop-blur-xl">
          <CtrlBtn active={!muted} onClick={() => setMuted(!muted)} label={muted ? "Mudo" : "Microfone"}>
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </CtrlBtn>
          <CtrlBtn active={videoOn} onClick={() => setVideoOn(!videoOn)} label="Câmera">
            <Video className="h-5 w-5" />
          </CtrlBtn>
          <CtrlBtn active={hand} onClick={() => setHand(!hand)} label={hand ? "Fila" : "Mão"}>
            <Hand className="h-5 w-5" />
          </CtrlBtn>
          <Link
            to="/rooms/$id/participants"
            params={{ id }}
            className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary hover:bg-secondary/80 transition">
              <Users className="h-5 w-5" />
            </span>
            Pessoas
          </Link>
          <CtrlBtn
            destructive
            onClick={() => navigate({ to: "/rooms" })}
            label="Sair"
          >
            <Phone className="h-5 w-5 rotate-[135deg]" />
          </CtrlBtn>
        </div>
      </div>
    </AppShell>
  );
}

function ChatLine({ name, text, time, mine }: { name: string; text: string; time?: string; mine?: boolean }) {
  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
        <span>{name}</span>
        {time && <span>· {time}</span>}
      </div>
      <div
        className={`mt-0.5 max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
          mine ? "bg-gradient-brand text-white rounded-br-xs" : "bg-secondary text-foreground rounded-tl-xs"
        }`}
      >
        {text}
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
