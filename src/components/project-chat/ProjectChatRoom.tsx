import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  Crown,
  ShieldCheck,
  Pin,
  PinOff,
  HelpCircle,
  BarChart3,
  MessageSquare,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  Play,
  Pause,
  PlusCircle,
  FileText,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Flame,
  ThumbsUp,
  Heart,
  Lightbulb,
  Radio,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import {
  getProjectChatData,
  sendProjectMessage,
  toggleReaction,
  togglePinMessage,
  voteOnPoll,
  answerProjectQuestion,
  generateOrganizerSimulatedReply,
  type ProjectChatData,
  type ChatMessage,
  type ChatPoll,
  type ProjectParticipant,
} from "@/lib/project-chat-store";
import { CURRENT_USER } from "@/data/mock-data";

interface ProjectChatRoomProps {
  projectId: string;
  backUrl?: string;
}

export function ProjectChatRoom({ projectId, backUrl = "/events" }: ProjectChatRoomProps) {
  const [data, setData] = useState<ProjectChatData>(() => getProjectChatData(projectId));
  const [activeTab, setActiveTab] = useState<"all" | "announcements" | "qa" | "polls">("all");
  const [isOrganizerMode, setIsOrganizerMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  // Message input state
  const [inputText, setInputText] = useState("");
  const [sendAsType, setSendAsType] = useState<"normal" | "question" | "announcement">("normal");

  // Voice recording simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordIntervalRef = useRef<any>(null);

  // Audio playing simulation state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Poll creation dialog state
  const [pollDialogOpen, setPollDialogOpen] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);

  // Question Answer dialog state (for Organizer)
  const [answeringQuestion, setAnsweringQuestion] = useState<ChatMessage | null>(null);
  const [organizerAnswerText, setOrganizerAnswerText] = useState("");

  // Pinned Banner Collapsible
  const [pinnedExpanded, setPinnedExpanded] = useState(true);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setData(getProjectChatData(projectId));
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [data.messages, activeTab]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording]);

  // Handle Send Message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const kind =
      isOrganizerMode && sendAsType === "announcement"
        ? "announcement"
        : !isOrganizerMode && sendAsType === "question"
        ? "question"
        : "normal";

    const senderName = isOrganizerMode ? data.organizer.name : CURRENT_USER.name;
    const senderInitials = isOrganizerMode ? data.organizer.initials : CURRENT_USER.initials;
    const senderRole = isOrganizerMode ? "Organizador" : "Participante";

    const newMsg = sendProjectMessage({
      projectId,
      senderName,
      initials: senderInitials,
      role: senderRole,
      isOrganizer: isOrganizerMode,
      avatarColor: isOrganizerMode ? data.organizer.avatarColor : CURRENT_USER.avatarColor,
      text: inputText.trim(),
      kind,
    });

    // Update local state
    setData(getProjectChatData(projectId));
    const sentText = inputText.trim();
    setInputText("");
    setSendAsType("normal");

    if (kind === "question") {
      toast.success("Dúvida enviada ao Organizador! ❓", {
        description: "Sua pergunta aparecerá na aba Q&A e o organizador responderá em breve.",
      });
    } else if (kind === "announcement") {
      toast.success("Aviso Oficial publicado com sucesso! 📢", {
        description: "Todos os participantes receberam uma notificação.",
      });
    } else {
      toast.success("Mensagem enviada!");
    }

    // If sent as participant normal message or question, trigger realistic organizer simulated reply
    if (!isOrganizerMode) {
      generateOrganizerSimulatedReply(projectId, sentText).then(() => {
        setData(getProjectChatData(projectId));
        toast.info(`Nova mensagem de ${data.organizer.name} (Organizador) 💬`);
      });
    }
  };

  // Handle Send Simulated Voice Note
  const handleFinishVoiceRecord = () => {
    setIsRecording(false);
    const duration = `0:${recordSeconds.toString().padStart(2, "0")}`;

    sendProjectMessage({
      projectId,
      senderName: isOrganizerMode ? data.organizer.name : CURRENT_USER.name,
      initials: isOrganizerMode ? data.organizer.initials : CURRENT_USER.initials,
      role: isOrganizerMode ? "Organizador" : "Participante",
      isOrganizer: isOrganizerMode,
      avatarColor: isOrganizerMode ? data.organizer.avatarColor : CURRENT_USER.avatarColor,
      text: isOrganizerMode
        ? "Áudio do Organizador com orientações do projeto."
        : "Mensagem de voz com dúvida / comentário.",
      kind: "voice",
      voiceDuration: duration,
    });

    setData(getProjectChatData(projectId));
    toast.success("Mensagem de voz enviada! 🎙️");
  };

  // Handle Quick Attachment
  const handleSendQuickAttachment = (name: string, type: "pdf" | "slides" | "link", size = "2.1 MB") => {
    sendProjectMessage({
      projectId,
      senderName: isOrganizerMode ? data.organizer.name : CURRENT_USER.name,
      initials: isOrganizerMode ? data.organizer.initials : CURRENT_USER.initials,
      role: isOrganizerMode ? "Organizador" : "Participante",
      isOrganizer: isOrganizerMode,
      avatarColor: isOrganizerMode ? data.organizer.avatarColor : CURRENT_USER.avatarColor,
      text: isOrganizerMode
        ? `Material oficial disponibilizado: ${name}`
        : `Compartilhando material complementar: ${name}`,
      kind: "attachment",
      attachment: {
        name,
        size,
        type,
      },
    });

    setData(getProjectChatData(projectId));
    toast.success("Material compartilhado na sala! 📄");
  };

  // Handle Reactions
  const handleToggleReaction = (messageId: string, emoji: string) => {
    const updated = toggleReaction(projectId, messageId, emoji, isOrganizerMode ? data.organizer.name : "Você");
    setData(updated);
  };

  // Handle Pin/Unpin (Organizer feature)
  const handleTogglePin = (messageId: string) => {
    if (!isOrganizerMode) {
      toast.error("Apenas o organizador pode fixar avisos importantes.");
      return;
    }
    const updated = togglePinMessage(projectId, messageId);
    setData(updated);
    toast.success(updated.pinnedMessageId === messageId ? "Mensagem fixada no topo! 📌" : "Mensagem desafixada.");
  };

  // Handle Poll Vote
  const handleVotePoll = (messageId: string, optionIndex: number) => {
    const updated = voteOnPoll(projectId, messageId, optionIndex, CURRENT_USER.id);
    setData(updated);
    toast.success("Seu voto foi registrado! 📊");
  };

  // Handle Create Poll
  const handleCreatePoll = () => {
    if (!newPollQuestion.trim()) {
      toast.error("Informe a pergunta da enquete.");
      return;
    }
    const filteredOptions = newPollOptions.filter((o) => o.trim().length > 0);
    if (filteredOptions.length < 2) {
      toast.error("Adicione pelo menos 2 opções de resposta.");
      return;
    }

    sendProjectMessage({
      projectId,
      senderName: data.organizer.name,
      initials: data.organizer.initials,
      role: "Organizador",
      isOrganizer: true,
      avatarColor: data.organizer.avatarColor,
      text: newPollQuestion.trim(),
      kind: "poll",
      poll: {
        question: newPollQuestion.trim(),
        options: filteredOptions,
      },
    });

    setData(getProjectChatData(projectId));
    setPollDialogOpen(false);
    setNewPollQuestion("");
    setNewPollOptions(["", ""]);
    toast.success("Enquete publicada para os participantes! 📊");
  };

  // Handle Answer Question (Organizer)
  const handleAnswerQuestionSubmit = () => {
    if (!answeringQuestion || !organizerAnswerText.trim()) return;

    const updated = answerProjectQuestion(
      projectId,
      answeringQuestion.id,
      organizerAnswerText.trim(),
      data.organizer.name
    );
    setData(updated);
    setAnsweringQuestion(null);
    setOrganizerAnswerText("");
    toast.success("Resposta do Organizador publicada com sucesso! ✅");
  };

  // Toggle Audio Play Simulation
  const togglePlayAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      // Automatically stop after 3 seconds simulation
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 4000);
    }
  };

  // Filter messages according to active tab and search query
  const filteredMessages = data.messages.filter((msg) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = msg.text.toLowerCase().includes(q);
      const matchSender = msg.sender.toLowerCase().includes(q);
      if (!matchText && !matchSender) return false;
    }

    if (activeTab === "announcements") {
      return msg.kind === "announcement" || msg.isPinned || msg.isOrganizer;
    }
    if (activeTab === "qa") {
      return msg.kind === "question";
    }
    if (activeTab === "polls") {
      return msg.kind === "poll";
    }
    return true;
  });

  const pinnedMessage = data.messages.find((m) => m.id === data.pinnedMessageId || m.isPinned);
  const questionsCount = data.messages.filter((m) => m.kind === "question").length;
  const unansweredQuestionsCount = data.messages.filter((m) => m.kind === "question" && !m.isQuestionAnswered).length;
  const announcementsCount = data.messages.filter((m) => m.kind === "announcement" || m.isPinned || m.isOrganizer).length;
  const pollsCount = data.messages.filter((m) => m.kind === "poll").length;

  return (
    <AppShell hideNav>
      <Toaster position="top-center" />

      {/* Header Sticky com Status do Organizador e Controles */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Lado Esquerdo: Voltar + Info do Projeto */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to={backUrl}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition hover:bg-secondary active:scale-95"
              aria-label="Voltar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-base font-bold text-foreground">
                  {data.projectTitle}
                </span>
                <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0 font-bold shrink-0">
                  {data.category}
                </Badge>
              </div>

              {/* Status do Organizador */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <Crown className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {data.organizer.name}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Ações & Alternador de Papel */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Botão de Busca */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
              title="Buscar mensagens"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Gaveta de Participantes */}
            <Sheet open={participantsOpen} onOpenChange={setParticipantsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl border-border/80 px-2.5 text-xs font-semibold flex items-center gap-1.5 hover:bg-secondary"
                >
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Membros</span>
                  <span className="rounded-full bg-primary/15 text-primary px-1.5 py-0 text-[10px] font-bold">
                    {data.participants.length}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px] p-5">
                <SheetHeader className="text-left pb-3 border-b border-border/60">
                  <SheetTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Participantes do Projeto
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    Comunidade conectada ao projeto "{data.projectTitle}".
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-4 space-y-4">
                  {/* Card do Organizador em destaque */}
                  <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Organizador Principal
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ativo agora
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-sm font-bold text-white shadow-soft">
                        {data.organizer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{data.organizer.name}</p>
                        <p className="text-xs text-muted-foreground">{data.organizer.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Outros Participantes */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                      Membros ({data.participants.length})
                    </p>

                    <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                      {data.participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-xl border border-border/70 p-2.5 bg-card hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.avatarColor} text-xs font-bold text-white`}>
                              {p.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-foreground flex items-center gap-1">
                                {p.name}
                                {p.isOrganizer && <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">{p.role}</p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {p.isOnline ? (
                              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Online" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" title="Offline" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Alternador de Papel (Organizador vs Participante) */}
            <button
              onClick={() => {
                const next = !isOrganizerMode;
                setIsOrganizerMode(next);
                if (next) {
                  toast.success("Modo Organizador Ativado! 👑", {
                    description: "Você agora pode emitir avisos oficiais, fixar mensagens e criar enquetes.",
                  });
                } else {
                  toast.info("Modo Participante Ativado 👤", {
                    description: "Você está visualizando a sala como participante do projeto.",
                  });
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all shadow-xs ${
                isOrganizerMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20 ring-2 ring-amber-400"
                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
              }`}
              title="Clique para alternar entre visão de Organizador e Participante"
            >
              {isOrganizerMode ? (
                <>
                  <Crown className="h-3.5 w-3.5 fill-white text-white" />
                  <span className="hidden xs:inline">Organizador</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden xs:inline">Participante</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Busca Expansível */}
        {showSearch && (
          <div className="mt-2.5 flex items-center gap-2 animate-in fade-in-50 slide-in-from-top-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar mensagens, dúvidas ou avisos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs rounded-xl bg-secondary/50"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setShowSearch(false);
              }}
              className="h-9 text-xs"
            >
              Fechar
            </Button>
          </div>
        )}

        {/* Abas de Navegação de Canais do Projeto */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-primary text-white shadow-soft font-bold"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat Geral</span>
            <span className={`text-[10px] rounded-full px-1.5 ${activeTab === "all" ? "bg-white/20 text-white" : "bg-muted text-foreground"}`}>
              {data.messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all whitespace-nowrap ${
              activeTab === "announcements"
                ? "bg-amber-500 text-white shadow-soft font-bold"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="h-3.5 w-3.5" />
            <span>Mural do Organizador</span>
            {announcementsCount > 0 && (
              <span className={`text-[10px] rounded-full px-1.5 ${activeTab === "announcements" ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"}`}>
                {announcementsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("qa")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all whitespace-nowrap ${
              activeTab === "qa"
                ? "bg-violet-600 text-white shadow-soft font-bold"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Dúvidas & Q&A</span>
            {questionsCount > 0 && (
              <span className={`text-[10px] rounded-full px-1.5 ${activeTab === "qa" ? "bg-white/20 text-white" : unansweredQuestionsCount > 0 ? "bg-rose-500 text-white" : "bg-muted text-foreground"}`}>
                {unansweredQuestionsCount > 0 ? `${unansweredQuestionsCount} pendentes` : questionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("polls")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all whitespace-nowrap ${
              activeTab === "polls"
                ? "bg-emerald-600 text-white shadow-soft font-bold"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Enquetes</span>
            {pollsCount > 0 && (
              <span className={`text-[10px] rounded-full px-1.5 ${activeTab === "polls" ? "bg-white/20 text-white" : "bg-muted text-foreground"}`}>
                {pollsCount}
              </span>
            )}
          </button>

          {/* Botão de Criar Enquete (se modo Organizador) */}
          {isOrganizerMode && (
            <button
              onClick={() => setPollDialogOpen(true)}
              className="ml-auto flex items-center gap-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 transition-all text-xs font-bold whitespace-nowrap shrink-0"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Nova Enquete
            </button>
          )}
        </div>
      </header>

      <div className="px-4 py-3 space-y-4 pb-36 max-w-4xl mx-auto">
        {/* Banner de Mensagem Fixada do Organizador (se houver) */}
        {pinnedMessage && (
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-3 shadow-xs animate-in fade-in-50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                  <Pin className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Crown className="h-3 w-3 fill-amber-500 text-amber-500" /> AVISO FIXADO PELO ORGANIZADOR
                    </span>
                    <span className="text-[10px] text-muted-foreground">{pinnedMessage.timestamp}</span>
                  </div>
                  <p className={`text-xs text-foreground font-medium mt-0.5 leading-relaxed ${pinnedExpanded ? "" : "line-clamp-1"}`}>
                    {pinnedMessage.text}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setPinnedExpanded(!pinnedExpanded)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                  title={pinnedExpanded ? "Recolher" : "Expandir"}
                >
                  {pinnedExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isOrganizerMode && (
                  <button
                    onClick={() => handleTogglePin(pinnedMessage.id)}
                    className="p-1 text-amber-600 hover:text-amber-700 rounded-lg"
                    title="Desafixar aviso"
                  >
                    <PinOff className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Informação sobre o Modo Atual */}
        {isOrganizerMode && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 p-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2 font-medium">
              <Crown className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
              <span>
                <strong>Modo Organizador Ativo:</strong> Suas mensagens terão destaque dourado de Host e você pode responder dúvidas oficiais.
              </span>
            </div>
          </div>
        )}

        {/* Lista de Mensagens */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
              <MessageSquare className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-foreground">Nenhuma mensagem nesta categoria</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Seja o primeiro a enviar uma mensagem ou dúvida para o organizador e participantes!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredMessages.map((msg) => {
              const isFromOrganizer = msg.isOrganizer;
              const isPinned = msg.isPinned;

              return (
                <div
                  key={msg.id}
                  className={`group relative rounded-3xl p-4 transition-all duration-200 ${
                    isFromOrganizer
                      ? "border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-card shadow-soft"
                      : msg.kind === "question"
                      ? "border-2 border-violet-500/30 bg-violet-500/5 shadow-xs"
                      : msg.kind === "poll"
                      ? "border-2 border-emerald-500/30 bg-emerald-500/5 shadow-xs"
                      : "border border-border/80 bg-card shadow-xs"
                  }`}
                >
                  {/* Top Bar da Mensagem */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                          msg.avatarColor || "from-blue-600 to-indigo-600"
                        } text-xs font-bold text-white shadow-soft`}
                      >
                        {msg.initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-foreground">{msg.sender}</span>

                          {/* Badge de Organizador vs Participante */}
                          {isFromOrganizer ? (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] px-2 py-0 font-extrabold flex items-center gap-1">
                              <Crown className="h-2.5 w-2.5 fill-white" /> ORGANIZADOR
                            </Badge>
                          ) : msg.kind === "question" ? (
                            <Badge className="bg-violet-500 text-white border-0 text-[10px] px-2 py-0 font-bold flex items-center gap-1">
                              <HelpCircle className="h-2.5 w-2.5" /> DÚVIDA
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] px-2 py-0 font-semibold">
                              {msg.role}
                            </Badge>
                          )}

                          {isPinned && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Pin className="h-2.5 w-2.5" /> Fixado
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-muted-foreground">{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Ações de Moderação / Pin */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {isOrganizerMode && (
                        <button
                          onClick={() => handleTogglePin(msg.id)}
                          className={`p-1.5 rounded-xl transition-colors ${
                            isPinned
                              ? "bg-amber-500 text-white"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                          title={isPinned ? "Desafixar do topo" : "Fixar no topo"}
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo da Mensagem */}
                  <div className="space-y-2.5 pl-1">
                    {/* Texto Normal ou Aviso */}
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-normal">
                      {msg.text}
                    </p>

                    {/* Mensagem de Áudio / Voice Note */}
                    {msg.kind === "voice" && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
                        <button
                          onClick={() => togglePlayAudio(msg.id)}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all ${
                            playingAudioId === msg.id
                              ? "bg-rose-500 text-white animate-pulse"
                              : "bg-primary text-white hover:scale-105 shadow-soft"
                          }`}
                        >
                          {playingAudioId === msg.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>

                        <div className="flex-1 space-y-1">
                          {/* Visualizador de Onda Sonora Simulado */}
                          <div className="flex items-center gap-0.5 h-6">
                            {[30, 70, 45, 90, 60, 100, 40, 80, 50, 65, 85, 40, 95, 30, 75, 50, 90, 60].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-300 ${
                                  playingAudioId === msg.id ? "bg-primary animate-bounce" : "bg-primary/40"
                                }`}
                                style={{
                                  height: `${playingAudioId === msg.id ? Math.min(100, h + Math.random() * 20) : h}%`,
                                  animationDelay: `${i * 50}ms`,
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                            <span>{playingAudioId === msg.id ? "Reproduzindo..." : "Mensagem de Voz"}</span>
                            <span>{msg.voiceDuration || "0:30"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Anexo de Arquivo / Material */}
                    {msg.attachment && (
                      <div className="rounded-2xl border border-border bg-card p-3 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-soft text-primary font-bold">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-foreground">{msg.attachment.name}</p>
                            <p className="text-[10px] text-muted-foreground">{msg.attachment.size} · PDF Preparatório</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.success(`Abrindo "${msg.attachment?.name}"...`);
                          }}
                          className="h-8 rounded-xl text-xs font-semibold shrink-0 gap-1 border-primary/30 text-primary hover:bg-primary/5"
                        >
                          Baixar <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    {/* Enquete Interativa (Poll) */}
                    {msg.poll && (
                      <div className="rounded-2xl border border-emerald-500/30 bg-card p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <BarChart3 className="h-4 w-4 text-emerald-500" /> {msg.poll.question}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {msg.poll.totalVotes} votos
                          </span>
                        </div>

                        <div className="space-y-2">
                          {msg.poll.options.map((opt, optIdx) => {
                            const percent =
                              msg.poll!.totalVotes > 0
                                ? Math.round((opt.votes / msg.poll!.totalVotes) * 100)
                                : 0;
                            const hasVotedThis = opt.votedUserIds.includes(CURRENT_USER.id);

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleVotePoll(msg.id, optIdx)}
                                className={`relative w-full overflow-hidden rounded-xl border p-2.5 text-left text-xs font-semibold transition-all hover:border-emerald-500/60 active:scale-[0.99] ${
                                  hasVotedThis
                                    ? "border-emerald-500 bg-emerald-500/10 font-bold"
                                    : "border-border/70 bg-secondary/40"
                                }`}
                              >
                                {/* Barra de Progresso Fundo */}
                                <div
                                  className="absolute inset-y-0 left-0 bg-emerald-500/20 transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />

                                <div className="relative z-10 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    {hasVotedThis && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                                    {opt.text}
                                  </span>
                                  <span className="font-mono text-[11px] text-muted-foreground ml-2">
                                    {percent}% ({opt.votes})
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Resposta do Organizador para Dúvidas (Q&A) */}
                    {msg.kind === "question" && (
                      <div className="mt-3 pt-2 border-t border-violet-500/20 space-y-2">
                        {msg.isQuestionAnswered && msg.organizerAnswer ? (
                          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Resposta Oficial do Organizador ({msg.organizerAnswer.answeredBy})
                              </span>
                              <span className="text-[10px] text-muted-foreground">{msg.organizerAnswer.timestamp}</span>
                            </div>
                            <p className="text-xs text-foreground leading-relaxed">
                              {msg.organizerAnswer.text}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                              <Clock className="h-3.5 w-3.5" /> Aguardando resposta do organizador
                            </span>

                            {isOrganizerMode && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setAnsweringQuestion(msg);
                                  setOrganizerAnswerText("");
                                }}
                                className="h-7 rounded-lg text-xs font-bold border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                              >
                                Responder como Organizador 💬
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Barra de Reações e Emojis */}
                    <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                      {msg.reactions.map((r) => {
                        const hasReacted = r.users.includes(isOrganizerMode ? data.organizer.name : "Você");
                        return (
                          <button
                            key={r.emoji}
                            onClick={() => handleToggleReaction(msg.id, r.emoji)}
                            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all active:scale-90 ${
                              hasReacted
                                ? "bg-primary/15 text-primary border border-primary/40 font-bold"
                                : "bg-secondary/60 text-muted-foreground hover:bg-secondary border border-border/60"
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="font-mono text-[11px]">{r.count}</span>
                          </button>
                        );
                      })}

                      {/* Botões rápidos de adicionar reações */}
                      {["👍", "❤️", "🔥", "👏", "💡"].map((emoji) => {
                        const alreadyInList = msg.reactions.some((r) => r.emoji === emoji);
                        if (alreadyInList) return null;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/30 hover:bg-secondary text-xs opacity-40 hover:opacity-100 transition-all active:scale-90"
                            title={`Reagir com ${emoji}`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Barra de Input Flutuante Inferior */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-4xl px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl border-t border-border/60">
        {/* Seletor de Tipo de Envio (Dúvida vs Normal vs Aviso) */}
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs">
            {isOrganizerMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setSendAsType(sendAsType === "announcement" ? "normal" : "announcement")}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                    sendAsType === "announcement"
                      ? "bg-amber-500 text-white shadow-soft"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Crown className="h-3 w-3" />
                  {sendAsType === "announcement" ? "Aviso Oficial Selecionado 📢" : "Enviar como Aviso Oficial"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendQuickAttachment("Slides_Apresentacao_Oratoria.pdf", "slides", "4.2 MB")}
                  className="flex items-center gap-1 rounded-full bg-secondary hover:bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                >
                  <Paperclip className="h-3 w-3" /> Anexar Slides
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSendAsType(sendAsType === "question" ? "normal" : "question")}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                    sendAsType === "question"
                      ? "bg-violet-600 text-white shadow-soft"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HelpCircle className="h-3 w-3" />
                  {sendAsType === "question" ? "Modo Dúvida Ativo ❓" : "Enviar como Dúvida ao Organizador"}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendQuickAttachment("Cronograma_Dinâmicas.pdf", "pdf", "1.5 MB")}
                  className="hidden sm:flex items-center gap-1 rounded-full bg-secondary hover:bg-secondary/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                >
                  <Paperclip className="h-3 w-3" /> Material
                </button>
              </>
            )}
          </div>

          <span className="text-[10px] text-muted-foreground font-medium">
            Enviando como: <strong>{isOrganizerMode ? data.organizer.name : CURRENT_USER.name}</strong>
          </span>
        </div>

        {/* Gravador de Áudio Simulado Ativo */}
        {isRecording ? (
          <div className="rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 p-3 flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
              <span>Gravando áudio para o organizador... 0:{recordSeconds.toString().padStart(2, "0")}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRecording(false)}
                className="h-8 rounded-xl text-xs text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleFinishVoiceRecord}
                className="h-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold gap-1"
              >
                <Send className="h-3 w-3" /> Enviar Áudio
              </Button>
            </div>
          </div>
        ) : (
          /* Campo de Texto Principal */
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                placeholder={
                  sendAsType === "question"
                    ? "Escreva sua dúvida para o organizador..."
                    : sendAsType === "announcement"
                    ? "Escreva um aviso oficial para todos os participantes..."
                    : "Converse com o organizador e participantes..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className={`h-12 rounded-2xl pl-4 pr-12 text-sm bg-card border-border/80 shadow-xs focus-visible:ring-2 ${
                  isOrganizerMode
                    ? "focus-visible:ring-amber-400 border-amber-500/30"
                    : sendAsType === "question"
                    ? "focus-visible:ring-violet-500 border-violet-500/30"
                    : "focus-visible:ring-primary"
                }`}
              />

              {/* Botão de Gravação de Áudio */}
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className="absolute right-3 top-3 p-1 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                title="Gravar mensagem de voz"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            {/* Botão de Enviar */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`h-12 w-12 shrink-0 rounded-2xl transition-all shadow-soft active:scale-95 ${
                isOrganizerMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : sendAsType === "question"
                  ? "bg-violet-600 text-white"
                  : "bg-gradient-brand text-white"
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Criação de Enquete (Organizador) */}
      <Dialog open={pollDialogOpen} onOpenChange={setPollDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <BarChart3 className="h-5 w-5 text-emerald-500" /> Criar Enquete para os Participantes
            </DialogTitle>
            <DialogDescription className="text-xs">
              Lance uma votação em tempo real para decidir dinâmicas, horários ou prioridades do projeto.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 my-2">
            <div>
              <label className="text-xs font-bold text-foreground">Pergunta da Enquete</label>
              <Input
                placeholder="Ex: Qual dinâmica vocês preferem praticar primeiro?"
                value={newPollQuestion}
                onChange={(e) => setNewPollQuestion(e.target.value)}
                className="mt-1 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Opções de Resposta</label>
              {newPollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}.</span>
                  <Input
                    placeholder={`Opção ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newPollOptions];
                      updated[idx] = e.target.value;
                      setNewPollOptions(updated);
                    }}
                    className="text-xs rounded-xl flex-1"
                  />
                  {newPollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setNewPollOptions(newPollOptions.filter((_, i) => i !== idx))}
                      className="text-muted-foreground hover:text-rose-500 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              {newPollOptions.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewPollOptions([...newPollOptions, ""])}
                  className="w-full h-8 text-xs font-semibold rounded-xl border-dashed"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" /> Adicionar Opção
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setPollDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleCreatePoll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Publicar Enquete 📊
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Responder Dúvida Oficial (Organizador) */}
      <Dialog open={!!answeringQuestion} onOpenChange={(open) => !open && setAnsweringQuestion(null)}>
        <DialogContent className="max-w-md rounded-3xl p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Responder Dúvida de Participante
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sua resposta será exibida com o selo oficial de Organizador.
            </DialogDescription>
          </DialogHeader>

          {answeringQuestion && (
            <div className="space-y-3 my-2">
              <div className="rounded-2xl bg-secondary/50 p-3 border border-border">
                <p className="text-[11px] font-bold text-muted-foreground mb-1">
                  Pergunta enviada por {answeringQuestion.sender}:
                </p>
                <p className="text-xs text-foreground font-medium">{answeringQuestion.text}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Sua Resposta Oficial</label>
                <Textarea
                  placeholder="Escreva a resposta e orientações para o participante..."
                  value={organizerAnswerText}
                  onChange={(e) => setOrganizerAnswerText(e.target.value)}
                  className="mt-1 text-xs rounded-xl min-h-[90px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setAnsweringQuestion(null)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleAnswerQuestionSubmit}
              disabled={!organizerAnswerText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Publicar Resposta Oficial ✅
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
