import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Send, Mic, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ai/chat")({
  head: () => ({ meta: [{ title: "Chat com a IA — Fala que eu te escuto+" }] }),
  component: ChatPage,
});

type Msg = { from: "ai" | "me"; text: string };

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "Olá! Sou seu mentor Fala que eu te escuto+. Vamos treinar algo hoje?" },
    { from: "me", text: "Quero praticar um pitch de 60 segundos." },
    { from: "ai", text: "Ótimo! Me conte sobre o produto e o público-alvo e criaremos juntos." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { from: "me", text: input }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "ai", text: "Anotado! Vou preparar um roteiro para você." }]);
    }, 500);
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Mentor Fala que eu te escuto+" subtitle="Assistente de oratória" back="/ai" />
      <div className="flex flex-col gap-3 px-5 pb-40">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "items-start gap-2"}`}>
            {m.from === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-3xl px-4 py-2.5 text-sm ${
              m.from === "me" ? "bg-gradient-brand text-white rounded-br-lg" : "bg-secondary rounded-tl-lg"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-lift">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Digite sua mensagem..."
            className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Mic className="h-4 w-4" />
          </button>
          <button onClick={send} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-white shadow-soft">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
