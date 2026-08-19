import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, MonitorUp, Phone, Timer, Send, Users, Sparkles, Heart } from "lucide-react";
import { MOCK_EVENTS } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/events/online/$id")({
  head: () => ({ meta: [{ title: "Transmissão Online — Fale+" }] }),
  component: OnlineEvent,
});

function OnlineEvent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[1];

  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [likes, setLikes] = useState(24);

  const [chat, setChat] = useState([
    { id: "1", user: "Marina Alves", text: "Excelente conteúdo sobre os 3 atos narrativos! 🔥" },
    { id: "2", user: "Lucas Duarte", text: "Estou anotando todas as dicas de gancho inicial." },
    { id: "3", user: "Carlos Eduardo", text: "Mantenham perguntas para a sessão final de Q&A." },
  ]);
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (!msg.trim()) return;
    setChat((prev) => [...prev, { id: String(Date.now()), user: "Você", text: msg.trim() }]);
    setMsg("");
  };

  const speaker = event.speakers[0] || { name: "Helena Vaz", role: "Estrategista Narrativa" };

  return (
    <AppShell hideNav>
      <PageHeader
        title={event.title}
        subtitle={`Transmissão ao vivo · ${event.confirmedCount} conectados`}
        back="/events"
      />
      <div className="px-5 space-y-4 pb-36">
        {/* Tela de Vídeo Principal */}
        <Card className="aspect-video overflow-hidden rounded-3xl border-0 bg-gradient-brand p-0 shadow-lift relative">
          <div className="flex h-full flex-col justify-between p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> AO VIVO
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold">
                <Timer className="h-3 w-3" /> 24:18
              </span>
            </div>

            <div className="text-center my-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur ring-4 ring-white/30">
                <span className="text-xl font-bold">{speaker.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <p className="mt-2 text-base font-bold">{speaker.name}</p>
              <p className="text-xs opacity-80">{speaker.role}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] opacity-90">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {event.confirmedCount} pessoas na sala
              </span>
              <button
                onClick={() => setLikes(l => l + 1)}
                className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-xs hover:bg-white/30 transition"
              >
                <Heart className="h-3.5 w-3.5 text-rose-300 fill-rose-300" /> {likes}
              </button>
            </div>
          </div>
        </Card>

        {/* Participantes na Plateia */}
        <div className="grid grid-cols-4 gap-2">
          {["MA", "LU", "CE", "AL"].map((p, idx) => (
            <div key={p} className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-secondary/80 border border-border text-foreground">
              <span className="text-xs font-bold text-primary">{p}</span>
              <span className="text-[9px] text-muted-foreground mt-0.5">{idx === 3 ? "Você" : "Ouvinte"}</span>
            </div>
          ))}
        </div>

        {/* Chat do Evento */}
        <Card className="rounded-3xl border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-bold text-foreground">Chat do Workshop</p>
            <span className="text-[10px] text-muted-foreground">Moderado por Fale+</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
            {chat.map((c) => (
              <div key={c.id} className="rounded-2xl bg-secondary/60 p-2.5">
                <p className="font-bold text-primary text-[10px]">{c.user}</p>
                <p className="mt-0.5 text-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Envie uma pergunta ou comentário..."
              className="h-10 rounded-2xl text-xs"
            />
            <button
              onClick={handleSend}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>

      {/* Controles da Transmissão */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="flex justify-around gap-2 rounded-3xl border border-border/80 bg-card/95 p-3 shadow-lift backdrop-blur-xl">
          <Ctrl active={micOn} onClick={() => setMicOn(!micOn)} label={micOn ? "Microfone" : "Mudo"}>
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Ctrl>
          <Ctrl active={videoOn} onClick={() => setVideoOn(!videoOn)} label="Câmera">
            {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Ctrl>
          <Ctrl active={screenSharing} onClick={() => setScreenSharing(!screenSharing)} label="Tela">
            <MonitorUp className="h-5 w-5" />
          </Ctrl>
          <Ctrl destructive onClick={() => navigate({ to: "/events" })} label="Sair">
            <Phone className="h-5 w-5 rotate-[135deg]" />
          </Ctrl>
        </div>
      </div>
    </AppShell>
  );
}

function Ctrl({
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
