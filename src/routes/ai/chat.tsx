import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  Wand2,
  Lightbulb,
  Sparkles,
  Zap,
  Brain,
  Wind,
  CheckCircle2,
  TrendingUp,
  VolumeX,
  Play,
  Pause,
  Award,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCurrentUser } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/ai/chat")({
  head: () => ({ meta: [{ title: "Mentor de IA Thorel — Fale+" }] }),
  component: ChatPage,
});

type SpeechMetric = {
  clarity: number;
  wpm: number;
  fillersCount: number;
};

type Msg = {
  id: string;
  from: "ai" | "me";
  text: string;
  time: string;
  tips?: string[];
  metrics?: SpeechMetric;
  reportCard?: {
    score: number;
    strengths: string[];
    improvement: string;
  };
};

const MODES = [
  { id: "pitch", label: "🎤 Pitch de Negócios" },
  { id: "exec", label: "💼 Oratória Executiva" },
  { id: "improv", label: "⚡ Improviso Livre" },
  { id: "calm", label: "🌿 Controle de Ansiedade" },
];

const QUICK_PROMPTS = [
  "🎯 Simular 3 perguntas difíceis de investidor",
  "⏱️ Treinar pitch de 60 segundos com cronômetro",
  "🔥 Como começar um discurso sem parecer nervoso?",
  "🌬️ Exercício de respiração 4-7-8 para agora",
  "💡 Avaliar minha postura em apresentações",
];

export function ChatPage() {
  const { user } = useCurrentUser();
  const firstName = user.name ? user.name.split(" ")[0] : "Orador";
  const [activeMode, setActiveMode] = useState("pitch");
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: "1",
      from: "ai",
      text: `Olá, ${firstName}! Sou o Thorel, seu mentor de oratória e comunicação de alto impacto.\n\nEstou pronto para analisar seu discurso por texto ou áudio. Qual apresentação vamos lapidar hoje?`,
      time: "09:00",
      tips: ["Pitch para Investidores", "Discurso Executivo", "Combate ao Nervosismo"],
    },
  ]);

  useEffect(() => {
    setMsgs((prevMsgs) =>
      prevMsgs.map((m) =>
        m.id === "1"
          ? {
              ...m,
              text: `Olá, ${firstName}! Sou o Thorel, seu mentor de oratória e comunicação de alto impacto.\n\nEstou pronto para analisar seu discurso por texto ou áudio. Qual apresentação vamos lapidar hoje?`,
            }
          : m
      )
    );
  }, [firstName]);

  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  const recordTimerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      setRecordTime(0);
      recordTimerRef.current = setInterval(() => {
        setRecordTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  const toggleAudioPlayback = (msgId: string) => {
    if (playingMsgId === msgId) {
      setPlayingMsgId(null);
      toast.info("Áudio pausado");
    } else {
      setPlayingMsgId(msgId);
      toast.success("Reproduzindo resposta em voz sintética do Thorel 🔊");

      // Auto stop simulation after 4s
      setTimeout(() => {
        setPlayingMsgId(null);
      }, 4000);
    }
  };

  const getAiResponse = (
    userInput: string
  ): { text: string; tips?: string[]; reportCard?: Msg["reportCard"] } => {
    const lower = userInput.toLowerCase();

    if (lower.includes("investidor") || lower.includes("pergunta")) {
      return {
        text: "Perfeito! Aqui estão 3 perguntas desafiadoras que investidores costumam fazer:\n\n1. 'Por que o cliente pagaria por isso em vez da opção grátis?'\n2. 'Qual é o seu Custo de Aquisição (CAC) e quanto tempo leva para recuperar?'\n3. 'Se uma Big Tech copiar sua idéia amanhã, qual é a sua defesa?'\n\nResponda uma delas em voz alta ou por texto para analisarmos sua assertividade!",
        tips: ["Responder pergunta 1", "Dica para manter a calma"],
        reportCard: {
          score: 9.1,
          strengths: ["Vocabulário assertivo", "Boa estrutura de argumento"],
          improvement: "Aumentar a pausa estratégica de 2s antes de responder",
        },
      };
    }

    if (lower.includes("pitch") || lower.includes("60") || lower.includes("cronômetro")) {
      return {
        text: "Excelente! Para um Pitch de 60s impecável, siga a estrutura dos 4 Atos:\n\n⏱️ 0-15s: O Problema Urgente do Mercado\n⏱️ 15-35s: Sua Solução & Proposta Única de Valor\n⏱️ 35-50s: Tração, Métricas e Prova Social\n⏱️ 50-60s: Chamada para Ação (CTA) Memorável\n\nGrave o seu rascunho de áudio agora clicando no microfone!",
        tips: ["Gravar Rascunho", "Exemplo de Gancho Inicial"],
      };
    }

    if (lower.includes("nervoso") || lower.includes("começar") || lower.includes("medo")) {
      return {
        text: "Superar o nervosismo nos primeiros 30 segundos é a chave!\n\nEm vez de 'Oi gente, tô meio nervoso...', use um desses 3 ganchos magnéticos:\n\n1. Pergunta Provocativa: 'Você sabia que 82% das reuniões terminam sem decisão?'\n2. História de 15 segundos: 'Há três anos, passei por um momento que mudou tudo...'\n3. Estatística Impactante: 'Mais de 10 milhões de pessoas sofrem com...'",
        tips: ["Treinar Gancho 1", "Fazer Exercício de Respiração"],
      };
    }

    if (lower.includes("respiração") || lower.includes("calma") || lower.includes("4-7-8")) {
      return {
        text: "Vamos desacelerar os batimentos cardíacos com a Respiração 4-7-8:\n\n🌬️ Inspire pelo nariz em 4 segundos...\n🛑 Segure os pulmões cheios por 7 segundos...\n💨 Solte o ar pela boca suavemente por 8 segundos...\n\nSinta a tensão no pescoço e ombros se dissipar. Repita 3 vezes!",
        tips: ["Estou mais calmo", "Continuar treino"],
      };
    }

    return {
      text: `Analisando seu treino: "${userInput}"\n\nVocê manteve excelente clareza de pensamento. Para maximizar o impacto emocional, enfatize as palavras de ação e faça uma pausa dramática de 1.5s após a conclusão principal.`,
      tips: ["Ver relatório completo", "Treinar novamente"],
      reportCard: {
        score: 8.8,
        strengths: ["Ritmo de fala constante", "Tom confiante"],
        improvement: "Reduzir hesitações no início da frase",
      },
    };
  };

  const send = async (textToSend?: string, isAudio = false) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    // Simulated/calculated metrics for user speech
    const metrics: SpeechMetric = {
      clarity: Math.floor(Math.random() * 10) + 90, // 90% - 99%
      wpm: Math.floor(Math.random() * 20) + 125, // 125 - 145 PPM
      fillersCount: isAudio ? 0 : Math.floor(Math.random() * 2),
    };

    const userMsg: Msg = {
      id: String(Date.now()),
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metrics,
    };

    setMsgs((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // 1. Try invoking real Supabase Edge Function 'thorel-ai'
      const { data, error } = await supabase.functions.invoke("thorel-ai", {
        body: {
          prompt: text,
          mode: activeMode,
          history: msgs.map((m) => ({
            role: m.from === "ai" ? "assistant" : "user",
            content: m.text,
          })),
        },
      });

      let responseText = "";
      let tips: string[] | undefined = undefined;
      let reportCard: Msg["reportCard"] = undefined;

      if (!error && data && data.text) {
        responseText = data.text;
        tips = data.tips;
        reportCard = data.reportCard;
      } else {
        // Fallback if Edge function is not deployed yet or returning local structure
        const fallback = getAiResponse(text);
        responseText = fallback.text;
        tips = fallback.tips;
        reportCard = fallback.reportCard;
      }

      const aiMsg: Msg = {
        id: String(Date.now() + 1),
        from: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tips,
        reportCard,
      };

      setMsgs((prev) => [...prev, aiMsg]);

      // 2. Persist to real Supabase tables if authenticated or active user
      try {
        const { data: session } = await supabase
          .from("ai_sessions")
          .insert({
            mode: activeMode,
            title: `Treino de ${activeMode.toUpperCase()}`,
            score: reportCard?.score || 8.8,
            feedback_summary: responseText.slice(0, 150),
            strengths: reportCard?.strengths || [],
            improvements: reportCard?.improvement ? [reportCard.improvement] : [],
          })
          .select("id")
          .single();

        if (session) {
          await supabase.from("ai_messages").insert([
            {
              session_id: session.id,
              sender: "me",
              text,
              metrics: metrics as any,
            },
            {
              session_id: session.id,
              sender: "ai",
              text: responseText,
              tips: tips as any,
              report_card: reportCard as any,
            },
          ]);
        }
      } catch (dbErr) {
        console.warn("Real Supabase session logging warning:", dbErr);
      }
    } catch (err) {
      console.error("Error in AI chat send:", err);
      const fallback = getAiResponse(text);
      const aiMsg: Msg = {
        id: String(Date.now() + 1),
        from: "ai",
        text: fallback.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tips: fallback.tips,
        reportCard: fallback.reportCard,
      };
      setMsgs((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      send(`Áudio gravado (${recordTime}s) - Prática de Pitch com ênfase vocal e pausas.`, true);
      toast.success("Áudio processado pela IA Thorel!");
    } else {
      setIsRecording(true);
      toast.info("Gravando áudio... Fale com clareza!");
    }
  };

  return (
    <AppShell hideNav>
      <Toaster position="top-center" />

      <PageHeader
        title="Mentor Virtual Thorel"
        subtitle="Inteligência Artificial para Oratória Executiva"
        back="/ai"
      />

      {/* Top Mode Selector Bar */}
      <div className="px-4 sm:px-6 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMode(m.id);
                toast.info(`Modo alternado para: ${m.label}`);
              }}
              className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                activeMode === m.id
                  ? "bg-gradient-brand text-white shadow-soft"
                  : "bg-secondary text-foreground hover:bg-secondary/90"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Feed */}
      <div className="flex flex-col gap-4 px-4 sm:px-6 pb-48 lg:pb-40 w-full max-w-md lg:max-w-4xl xl:max-w-5xl mx-auto">
        {msgs.map((m) => {
          const isAI = m.from === "ai";
          const isPlayingThis = playingMsgId === m.id;

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAI ? "items-start" : "items-end"} animate-in fade-in-50 duration-200`}
            >
              <div
                className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] lg:max-w-[75%] ${
                  !isAI ? "flex-row-reverse" : ""
                }`}
              >
                {isAI && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft ring-2 ring-primary/20">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`rounded-3xl p-4 text-sm leading-relaxed shadow-xs relative ${
                    !isAI
                      ? "bg-gradient-brand text-white rounded-br-xs"
                      : "bg-card border border-border text-foreground rounded-tl-xs"
                  }`}
                >
                  {/* Badge de Métricas do Usuário */}
                  {!isAI && m.metrics && (
                    <div className="mb-2 pb-2 border-b border-white/20 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-white/90">
                      <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ⚡ Clareza: {m.metrics.clarity}%
                      </span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ⏱️ {m.metrics.wpm} PPM
                      </span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ✨ Vícios: {m.metrics.fillersCount}
                      </span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Player de Áudio Simulado para IA */}
                  {isAI && (
                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleAudioPlayback(m.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          isPlayingThis
                            ? "bg-emerald-500 text-white shadow-soft animate-pulse"
                            : "bg-secondary text-primary hover:bg-primary/10"
                        }`}
                      >
                        {isPlayingThis ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{isPlayingThis ? "Reproduzindo..." : "🔊 Ouvir em Áudio"}</span>
                      </button>

                      {isPlayingThis && (
                        <div className="flex items-end gap-0.5 h-3">
                          {[8, 14, 10, 16, 12].map((h, i) => (
                            <span key={i} className="w-0.5 bg-emerald-500 rounded-full animate-bounce" style={{ height: `${h}px` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Diagnostic Card da IA se houver */}
                  {m.reportCard && (
                    <div className="mt-3 rounded-2xl bg-secondary/50 p-3 border border-border/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-foreground flex items-center gap-1 text-[11px]">
                          <Award className="h-3.5 w-3.5 text-amber-500" /> Relatório de Desempenho
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Nota {m.reportCard.score} / 10
                        </span>
                      </div>

                      <div className="pt-1 space-y-1 text-muted-foreground text-[11px]">
                        <p className="font-semibold text-foreground">Pontos Fortes:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {m.reportCard.strengths.map((s, idx) => (
                            <li key={idx} className="text-emerald-600 dark:text-emerald-400">{s}</li>
                          ))}
                        </ul>

                        <p className="font-semibold text-foreground pt-1">Ponto de Melhoria:</p>
                        <p className="text-amber-600 dark:text-amber-400 font-medium">
                          → {m.reportCard.improvement}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Botões de Ação de Sugestão */}
                  {m.tips && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                      {m.tips.map((t) => (
                        <button
                          key={t}
                          onClick={() => send(t)}
                          className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                        >
                          <span>{t}</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground px-2 pt-1 font-medium">{m.time}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11 py-1">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="font-semibold text-primary">Thorel AI está calculando feedback...</span>
          </div>
        )}
      </div>

      {/* Prompts Rápidos e Input Fixo Responsivo */}
      <div className="fixed inset-x-0 bottom-0 z-30 lg:left-64 bg-background/95 backdrop-blur-xl border-t border-border/40 transition-all">
        <div className="mx-auto w-full max-w-md lg:max-w-4xl xl:max-w-5xl px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2.5">
          {/* Prompts Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-primary/5 transition shadow-xs flex items-center gap-1"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Status Bar de Gravação se gravando */}
          {isRecording && (
            <div className="mb-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-2.5 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold animate-in fade-in-50">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                Gravando sua fala em áudio...
              </span>
              <span className="font-mono bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                00:{recordTime < 10 ? `0${recordTime}` : recordTime} / 00:60
              </span>
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 sm:p-2 shadow-lift hover:border-primary/30 transition-all">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={isRecording ? "Gravando áudio..." : "Digite ou grave seu discurso..."}
              className="h-10 sm:h-11 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs sm:text-sm px-3"
            />

            <button
              onClick={handleMicClick}
              className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full transition-all ${
                isRecording
                  ? "bg-rose-600 text-white shadow-lg animate-bounce"
                  : "bg-secondary text-foreground hover:bg-secondary/80 hover:text-primary"
              }`}
              title="Gravar fala por microfone"
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <button
              onClick={() => send()}
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-white shadow-soft hover:opacity-95 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

