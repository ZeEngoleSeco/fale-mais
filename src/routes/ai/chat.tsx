import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Sparkles, Volume2, Bot, Wand2, Lightbulb } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ai/chat")({
  head: () => ({ meta: [{ title: "Mentor de IA — Fale+" }] }),
  component: ChatPage,
});

type Msg = { id: string; from: "ai" | "me"; text: string; time: string; tips?: string[] };

const QUICK_PROMPTS = [
  "Simular 3 perguntas difíceis de investidor",
  "Treinar pitch de 60 segundos com cronômetro",
  "Como começar um discurso sem parecer nervoso?",
  "Exercício de respiração guiada para agora",
];

export function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "1",
      from: "ai",
      text: "Olá, Ana! Sou o Thorel, seu mentor de oratória e comunicação de alto impacto. Qual desafio de fala vamos destravar hoje?",
      time: "09:00",
      tips: ["Pitch de Negócios", "Reunião de Diretoria", "Combate ao Nervosismo"],
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const getAiResponse = (userInput: string): { text: string; tips?: string[] } => {
    const lower = userInput.toLowerCase();
    if (lower.includes("investidor") || lower.includes("pergunta")) {
      return {
        text: "Perfeito! Aqui estão 3 perguntas que investidores costumam fazer para testar sua firmeza:\n\n1. 'Por que seu cliente pagaria por isso em vez de usar a alternativa grátis?'\n2. 'Qual é o seu custo de aquisição (CAC) e como ele escala?'\n3. 'Se o Google ou uma grande empresa lançar isso amanhã, qual sua barreira de defesa?'\n\nEscolha uma delas e me responda em voz alta!",
        tips: ["Responda com números", "Faça pausa de 2s antes de falar"],
      };
    }
    if (lower.includes("pitch") || lower.includes("60")) {
      return {
        text: "Vamos lá! Estruture seu Pitch de 60s nesta fórmula comprovada:\n\n⏱️ 0-15s: O Problema doloroso do cliente\n⏱️ 15-35s: Sua Solução inovadora e diferencial\n⏱️ 35-50s: Tração, métricas ou depoimento chave\n⏱️ 50-60s: Chamada para ação clara (CTA).\n\nDigite ou grave o seu rascunho para eu avaliar a clareza e o ritmo!",
      };
    }
    if (lower.includes("nervoso") || lower.includes("começar")) {
      return {
        text: "O maior erro é começar pedindo desculpas ou com 'Gente, tô um pouco nervoso'.\n\nEm vez disso, use uma destas 3 aberturas magnéticas:\n\n1. Uma pergunta reflexiva: 'Quantos de vocês já sentiram...?'\n2. Uma estatística surpreendente: '87% das decisões de compra...'\n3. Uma história de 2 frases: 'Na última terça-feira, recebi uma ligação que mudou tudo...'",
      };
    }
    if (lower.includes("respiração") || lower.includes("calma")) {
      return {
        text: "Vamos fazer o ciclo 4-7-8 agora:\n\n🌬️ Inspire pelo nariz contando 1... 2... 3... 4\n🛑 Segure o ar: 1... 2... 3... 4... 5... 6... 7\n💨 Solte lentamente pela boca: 1... 2... 3... 4... 5... 6... 7... 8\n\nSinta os ombros relaxarem. Repita isso 3 vezes e seu batimento cardíaco normaliza!",
      };
    }
    return {
      text: `Excelente reflexão sobre "${userInput}". Recomendo que você pratique falar essa ideia enfatizando as palavras-chave e fazendo uma pausa de 1 segundo após cada frase principal. Quer que eu simule uma plateia para você praticar?`,
      tips: ["Praticar fala", "Ver métricas detalhadas"],
    };
  };

  const send = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Msg = {
      id: String(Date.now()),
      from: "me",
      text,
      time: "Agora",
    };
    setMsgs((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAiResponse(text);
      const aiMsg: Msg = {
        id: String(Date.now() + 1),
        from: "ai",
        text: response.text,
        time: "Agora",
        tips: response.tips,
      };
      setMsgs((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <AppShell hideNav>
      <PageHeader title="Mentor Thorel (IA)" subtitle="Treinamento guiado de oratória" back="/ai" />

      <div className="flex flex-col gap-3 px-5 pb-44">
        {msgs.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}>
            <div className={`flex items-start gap-2.5 max-w-[88%] ${m.from === "me" ? "flex-row-reverse" : ""}`}>
              {m.from === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white shadow-soft">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  m.from === "me"
                    ? "bg-gradient-brand text-white rounded-br-xs"
                    : "bg-card border border-border text-foreground rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.tips && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {m.tips.map((t) => (
                      <button
                        key={t}
                        onClick={() => send(t)}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition"
                      >
                        {t} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground px-2 pt-1">{m.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            Thorel está digitando...
          </div>
        )}
      </div>

      {/* Prompts Rápidos e Input Fixo */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md bg-background/90 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-xl border-t border-border/40">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="shrink-0 rounded-full border border-border/80 bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-lift">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={isRecording ? "Gravando áudio..." : "Pergunte ao mentor ou pratique seu texto..."}
            className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs sm:text-sm"
          />
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              if (!isRecording) {
                setTimeout(() => {
                  setIsRecording(false);
                  send("Pratiquei um trecho em áudio de 20 segundos focando em modulação e pausas.");
                }, 3000);
              }
            }}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
              isRecording ? "bg-rose-600 text-white animate-pulse" : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
            title="Gravar fala por microfone"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button
            onClick={() => send()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white shadow-soft hover:opacity-90 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
