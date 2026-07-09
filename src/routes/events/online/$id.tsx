import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Video, MonitorUp, Phone, Timer, Send } from "lucide-react";

export const Route = createFileRoute("/events/online/$id")({
  head: () => ({ meta: [{ title: "Evento online — Fala que eu te escuto" }] }),
  component: OnlineEvent,
});

function OnlineEvent() {
  return (
    <AppShell hideNav>
      <PageHeader title="Evento ao vivo" subtitle="Workshop online" back="/events" />
      <div className="px-5 space-y-4">
        <Card className="aspect-video overflow-hidden rounded-3xl border-0 bg-gradient-brand p-0 shadow-lift">
          <div className="flex h-full items-center justify-center text-white">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Video className="h-7 w-7" />
              </div>
              <p className="mt-3 text-sm font-semibold">Transmissão principal</p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                <Timer className="h-3 w-3" /> 12:04
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-4 gap-2">
          {["P1","P2","P3","P4"].map((p) => (
            <div key={p} className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-soft text-primary">
              <span className="text-sm font-bold">{p}</span>
            </div>
          ))}
        </div>

        <Card className="rounded-3xl p-4">
          <p className="text-sm font-semibold">Chat</p>
          <div className="mt-2 space-y-2 text-sm">
            <div className="rounded-2xl bg-secondary px-3 py-2">
              <p className="text-[10px] font-semibold text-primary">Marina</p>
              Excelente conteúdo!
            </div>
            <div className="rounded-2xl bg-secondary px-3 py-2">
              <p className="text-[10px] font-semibold text-primary">Lucas</p>
              Anotando aqui.
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input placeholder="Mensagem..." className="h-10 rounded-2xl" />
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-brand text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <div className="flex justify-around gap-2 rounded-3xl border border-border bg-card p-3 shadow-soft">
          <Ctrl label="Microfone"><Mic className="h-5 w-5" /></Ctrl>
          <Ctrl label="Câmera"><Video className="h-5 w-5" /></Ctrl>
          <Ctrl label="Tela"><MonitorUp className="h-5 w-5" /></Ctrl>
          <Ctrl label="Sair" destructive><Phone className="h-5 w-5 rotate-[135deg]" /></Ctrl>
        </div>
      </div>
    </AppShell>
  );
}

function Ctrl({ children, label, destructive }: { children: React.ReactNode; label: string; destructive?: boolean }) {
  return (
    <button className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${destructive ? "bg-destructive text-white" : "bg-secondary"}`}>
        {children}
      </span>
      {label}
    </button>
  );
}
