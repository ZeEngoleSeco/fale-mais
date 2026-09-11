import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Phone,
  Timer,
  Send,
  Users,
  Heart,
  Flame,
  Hand,
  Sparkles,
  ThumbsUp,
  FileText,
  MessageSquare,
  BookOpen,
  Share2,
  Volume2,
  Tv,
} from "lucide-react";
import { MOCK_EVENTS } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/events/online/$id")({
  head: () => ({ meta: [{ title: "Transmissão Online — Fale+" }] }),
  component: OnlineEvent,
});

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

export function OnlineEvent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[1];

  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [likes, setLikes] = useState(48);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  // Active tab under video screen: 'chat' | 'program' | 'materials'
  const [activeTab, setActiveTab] = useState<"chat" | "program" | "materials">("chat");

  const [chat, setChat] = useState([
    { id: "1", user: "Marina Alves", text: "Excelente conteúdo sobre os 3 atos narrativos! 🔥", likes: 5 },
    { id: "2", user: "Lucas Duarte", text: "Estou anotando todas as dicas de gancho inicial.", likes: 2 },
    { id: "3", user: "Carlos Eduardo", text: "Mantenham perguntas para a sessão final de Q&A.", likes: 8 },
  ]);
  const [msg, setMsg] = useState("");

  const triggerReaction = (emoji: string) => {
    setLikes((l) => l + 1);
    const newId = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) + 20; // 20% to 80% horizontal position
    setReactions((prev) => [...prev, { id: newId, emoji, x }]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newId));
    }, 2000);
  };

  const handleSend = (overrideText?: string) => {
    const textToSend = (overrideText || msg).trim();
    if (!textToSend) return;
    setChat((prev) => [...prev, { id: String(Date.now()), user: "Você", text: textToSend, likes: 0 }]);
    if (!overrideText) setMsg("");
    toast.success("Mensagem enviada no chat!");
  };

  const toggleLikeMessage = (msgId: string) => {
    setChat((prev) =>
      prev.map((c) => (c.id === msgId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const toggleRaiseHand = () => {
    setHandRaised((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Mão levantada! ✋", {
          description: "O facilitador foi notificado e dará a palavra em breve.",
        });
      } else {
        toast.info("Mão abaixada.");
      }
      return next;
    });
  };

  const speaker = event.speakers[0] || { name: "Helena Vaz", role: "Estrategista Narrativa", company: "StoryWorks" };

  return (
    <AppShell hideNav>
      <Toaster position="top-center" />
      <PageHeader
        title={event.title}
        subtitle={`Transmissão ao vivo · ${event.confirmedCount} na sala`}
        back="/events"
      />

      <div className="px-5 space-y-4 pb-36">
        {/* Tela de Vídeo Principal com Animação de Reações Flutuantes */}
        <Card className="aspect-video overflow-hidden rounded-3xl border-0 bg-gradient-brand p-0 shadow-lift relative group">
          {/* Layer de Reações Flutuantes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="absolute bottom-6 text-2xl animate-bounce transition-all duration-1000"
                style={{
                  left: `${r.x}%`,
                  transform: "translateY(-120px)",
                  opacity: 0.8,
                }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          <div className="flex h-full flex-col justify-between p-4 text-white relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> AO VIVO
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold">
                  <Tv className="h-3 w-3" /> Fale+ HD
                </span>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold">
                <Timer className="h-3 w-3" /> 24:18
              </span>
            </div>

            {/* Apresentador Central */}
            <div className="text-center my-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur ring-4 ring-white/30 shadow-lg relative">
                <span className="text-xl font-bold">
                  {speaker.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                  <Volume2 className="h-3 w-3 text-white animate-pulse" />
                </span>
              </div>
              <p className="mt-2 text-base font-extrabold">{speaker.name}</p>
              <p className="text-xs opacity-80">{speaker.role} · {speaker.company}</p>
            </div>

            {/* Bottom Bar da Tela com Reações Rápidas */}
            <div className="flex items-center justify-between text-[11px] opacity-95">
              <span className="flex items-center gap-1 font-semibold">
                <Users className="h-3.5 w-3.5" /> {event.confirmedCount} online
              </span>

              {/* Botões de Emoji Rápido */}
              <div className="flex items-center gap-1.5">
                {["❤️", "🔥", "👏", "💡"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur text-sm hover:bg-white/30 transition-transform active:scale-125"
                  >
                    {emoji}
                  </button>
                ))}

                <button
                  onClick={() => triggerReaction("❤️")}
                  className="flex items-center gap-1 rounded-full bg-rose-500/80 backdrop-blur px-2.5 py-1 text-xs hover:bg-rose-600 transition font-bold"
                >
                  <Heart className="h-3.5 w-3.5 fill-white" /> {likes}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Grade de Audiência + Botão Levantar a Mão */}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-4 gap-2 flex-1">
            {["MA", "LU", "CE"].map((p) => (
              <div
                key={p}
                className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-secondary/80 border border-border text-foreground text-xs font-bold"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{p}</span>
              </div>
            ))}
            <div className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-gradient-soft border border-primary/30 text-primary text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Você</span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={toggleRaiseHand}
            className={`h-11 rounded-2xl text-xs font-bold px-3 transition-all shrink-0 ${
              handRaised
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-soft"
                : "bg-secondary text-foreground hover:bg-secondary/90"
            }`}
          >
            <Hand className={`h-4 w-4 mr-1 ${handRaised ? "animate-bounce" : ""}`} />
            {handRaised ? "Erguida ✋" : "Levantar Mão"}
          </Button>
        </div>

        {/* Abas de Conteúdo do Workshop */}
        <div className="flex rounded-2xl bg-secondary p-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "chat"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Chat Ao Vivo
          </button>
          <button
            onClick={() => setActiveTab("program")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "program"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Programação
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "materials"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Materiais
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        {activeTab === "chat" && (
          <Card className="rounded-3xl border-border p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" /> Chat Interativo da Sala
              </p>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Ao Vivo
              </span>
            </div>

            {/* Chat Messages */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1.5 text-xs minimal-scrollbar">
              {chat.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-secondary/60 p-3 flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="font-extrabold text-primary text-[11px]">{c.user}</p>
                    <p className="mt-0.5 text-foreground leading-relaxed">{c.text}</p>
                  </div>
                  <button
                    onClick={() => toggleLikeMessage(c.id)}
                    className="flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    <ThumbsUp className="h-3 w-3" /> {c.likes}
                  </button>
                </div>
              ))}
            </div>

            {/* Reações Rápidas em 1 Clique */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {["Sensacional! 🔥", "Como aplicar isso? ❓", "Muito claro! 👏"].map((quickText) => (
                <button
                  key={quickText}
                  onClick={() => handleSend(quickText)}
                  className="shrink-0 rounded-full bg-secondary text-foreground hover:bg-primary/10 hover:text-primary px-3 py-1 text-[11px] font-medium transition-colors border border-border/60"
                >
                  {quickText}
                </button>
              ))}
            </div>

            {/* Input de Envio */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Envie uma pergunta ou comentário..."
                className="h-10 rounded-2xl text-xs"
              />
              <button
                onClick={() => handleSend()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft hover:opacity-95 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </Card>
        )}

        {activeTab === "program" && (
          <Card className="rounded-3xl border-border p-4 shadow-sm space-y-3">
            <p className="text-xs font-bold text-foreground">Programação e Tópicos da Transmissão</p>

            <div className="space-y-2.5 text-xs">
              {event.agenda && event.agenda.length > 0 ? (
                event.agenda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-b border-border/40 pb-2.5 last:border-0">
                    <span className="rounded-md bg-gradient-brand px-2 py-1 font-mono font-bold text-white text-[10px]">
                      {item.time}
                    </span>
                    <span className="text-foreground leading-relaxed">{item.activity}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-xs">Informações da aula disponíveis durante a transmissão.</p>
              )}
            </div>
          </Card>
        )}

        {activeTab === "materials" && (
          <Card className="rounded-3xl border-border p-4 shadow-sm space-y-3">
            <p className="text-xs font-bold text-foreground">Materiais da Aula & Slides</p>

            <div className="space-y-2">
              <div
                onClick={() => toast.success("Download iniciado do PDF de Slides!")}
                className="flex items-center justify-between p-3 rounded-2xl bg-secondary/60 hover:bg-secondary border border-border cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Slides do Workshop (PDF)</p>
                    <p className="text-[10px] text-muted-foreground">Resumo dos 3 Atos Narrativos · 4.2 MB</p>
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full text-[10px]">Baixar</Badge>
              </div>
            </div>
          </Card>
        )}
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

