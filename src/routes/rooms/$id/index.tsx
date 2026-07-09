import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, MicOff, Video, Hand, Phone, MessageSquare, Timer, Settings, Users, Send } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/rooms/$id/")({
  head: () => ({ meta: [{ title: "Sala — Fala que eu te escuto" }] }),
  component: RoomPage,
});

function RoomPage() {
  const { id } = Route.useParams();
  const [muted, setMuted] = useState(false);
  const [hand, setHand] = useState(false);

  return (
    <AppShell>
      <PageHeader
        title={`Sala ${id}`}
        subtitle="Ao vivo · 12 participantes"
        back="/rooms"
        action={
          <Link to="/rooms/$id/settings" params={{ id }} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card">
            <Settings className="h-4 w-4" />
          </Link>
        }
      />
      <div className="px-5">
        <Card className="rounded-3xl border-0 bg-gradient-brand p-5 text-white shadow-lift">
          <div className="flex items-center justify-between text-xs opacity-90">
            <span>Apresentando</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5">
              <Timer className="h-3 w-3" /> 02:34
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
              JR
            </div>
            <div>
              <p className="text-lg font-bold">João Ribeiro</p>
              <p className="text-xs opacity-90">Pitch de 60s · Turno 3</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary">
              Iniciar apresentação
            </button>
            <button className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white">
              Finalizar
            </button>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {["MA", "LU", "CA", "PE"].map((p) => (
            <div key={p} className="flex flex-col items-center gap-1 rounded-2xl bg-card p-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-soft text-xs font-bold text-primary">
                {p}
              </div>
              <p className="text-[10px] text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>

        <Card className="mt-4 rounded-3xl border-border p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="h-4 w-4 text-primary" /> Chat da sala
          </div>
          <div className="space-y-2 text-sm">
            <ChatLine name="Marina" text="Bora! 🚀" />
            <ChatLine name="Lucas" text="Boa introdução!" />
            <ChatLine name="Você" mine text="Obrigado 🙌" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input placeholder="Mensagem..." className="h-10 rounded-2xl" />
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="mt-4 rounded-3xl border-border p-4">
          <p className="text-sm font-semibold">Feedback rápido</p>
          <p className="mt-1 text-xs text-muted-foreground">Deixe uma nota para quem apresentou.</p>
          <div className="mt-3 flex gap-1.5">
            {[1,2,3,4,5].map((n) => (
              <button key={n} className="text-2xl leading-none">⭐</button>
            ))}
          </div>
        </Card>

        <div className="mt-4 flex justify-around gap-2 rounded-3xl border border-border bg-card p-3 shadow-soft">
          <CtrlBtn active={!muted} onClick={() => setMuted(!muted)} label={muted ? "Ativar" : "Mutar"}>
            {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </CtrlBtn>
          <CtrlBtn label="Câmera"><Video className="h-5 w-5" /></CtrlBtn>
          <CtrlBtn active={hand} onClick={() => setHand(!hand)} label="Mão">
            <Hand className="h-5 w-5" />
          </CtrlBtn>
          <Link to="/rooms/$id/participants" params={{ id }} className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
              <Users className="h-5 w-5" />
            </span>
            Pessoas
          </Link>
          <CtrlBtn destructive label="Sair"><Phone className="h-5 w-5 rotate-[135deg]" /></CtrlBtn>
        </div>
      </div>
    </AppShell>
  );
}

function ChatLine({ name, text, mine }: { name: string; text: string; mine?: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : ""}`}>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-gradient-brand text-white" : "bg-secondary"}`}>
        {!mine && <p className="mb-0.5 text-[10px] font-semibold opacity-80">{name}</p>}
        {text}
      </div>
    </div>
  );
}

function CtrlBtn({
  children, label, active, destructive, onClick,
}: { children: React.ReactNode; label: string; active?: boolean; destructive?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
        destructive ? "bg-destructive text-white" : active ? "bg-gradient-brand text-white shadow-soft" : "bg-secondary"
      }`}>
        {children}
      </span>
      {label}
    </button>
  );
}
