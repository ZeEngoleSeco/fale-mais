import { MOCK_EVENTS, MOCK_ROOMS, CURRENT_USER, type UserProfile } from "@/data/mock-data";

export interface ChatReaction {
  emoji: string;
  count: number;
  users: string[]; // names of users who reacted
}

export interface ChatReply {
  id: string;
  sender: string;
  role: string;
  isOrganizer: boolean;
  avatarColor?: string;
  text: string;
  timestamp: string;
}

export interface ChatPollOption {
  text: string;
  votes: number;
  votedUserIds: string[];
}

export interface ChatPoll {
  id: string;
  question: string;
  createdBy: string;
  isOrganizer: boolean;
  options: ChatPollOption[];
  totalVotes: number;
  closed?: boolean;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  sender: string;
  senderId?: string;
  initials: string;
  avatarColor?: string;
  role: string;
  isOrganizer: boolean;
  isMe?: boolean;
  text: string;
  timestamp: string;
  kind: "normal" | "announcement" | "question" | "voice" | "poll" | "attachment";
  isPinned?: boolean;
  reactions: ChatReaction[];
  replies?: ChatReply[];
  // For questions (Q&A)
  isQuestionAnswered?: boolean;
  organizerAnswer?: {
    text: string;
    answeredBy: string;
    timestamp: string;
  };
  // For voice notes
  voiceDuration?: string; // e.g. "0:24"
  // For polls
  poll?: ChatPoll;
  // For attachments
  attachment?: {
    name: string;
    size: string;
    type: "pdf" | "slides" | "link" | "image";
    url?: string;
  };
}

export interface ProjectParticipant {
  id: string;
  name: string;
  initials: string;
  role: string;
  isOrganizer: boolean;
  avatarColor: string;
  isOnline: boolean;
  badges?: string[];
  joinedAt?: string;
}

export interface ProjectChatData {
  projectId: string;
  projectTitle: string;
  category: string;
  type: "event" | "room";
  organizer: {
    name: string;
    initials: string;
    role: string;
    company?: string;
    avatarColor: string;
  };
  pinnedMessageId?: string;
  participants: ProjectParticipant[];
  messages: ChatMessage[];
}

const STORAGE_PREFIX = "fale_mais_project_chat_v1_";

// Initial seed generators for events and rooms
function getSeedDataForProject(projectId: string): ProjectChatData {
  // Check if it's an event
  const event = MOCK_EVENTS.find((e) => e.id === projectId);
  if (event) {
    return {
      projectId,
      projectTitle: event.title,
      category: event.category,
      type: "event",
      organizer: {
        name: event.organizer.name,
        initials: event.organizer.initials || "FM",
        role: "Organizador Principal & Facilitador",
        company: event.speakers?.[0]?.company || "Fale+ Academy",
        avatarColor: "from-amber-500 to-orange-600",
      },
      pinnedMessageId: `pin-${projectId}-1`,
      participants: [
        {
          id: "p-org-1",
          name: event.organizer.name,
          initials: event.organizer.initials || "FM",
          role: "Organizador Principal",
          isOrganizer: true,
          avatarColor: "from-amber-500 to-orange-600",
          isOnline: true,
          badges: ["Organizador", "Host Oficial"],
        },
        {
          id: "p-speaker-1",
          name: event.speakers?.[0]?.name || "Carlos Eduardo",
          initials: (event.speakers?.[0]?.name || "Carlos Eduardo").split(" ").map((n) => n[0]).join(""),
          role: "Palestrante Convidado",
          isOrganizer: false,
          avatarColor: "from-violet-600 to-purple-600",
          isOnline: true,
          badges: ["TEDx Speaker", "Mentor"],
        },
        {
          id: "p-user-1",
          name: CURRENT_USER.name,
          initials: CURRENT_USER.initials,
          role: "Participante Inscrito",
          isOrganizer: false,
          avatarColor: "from-blue-600 to-indigo-600",
          isOnline: true,
          badges: ["Orador em Evolução"],
        },
        {
          id: "p-user-2",
          name: "Marina Alves",
          initials: "MA",
          role: "Participante Confirmada",
          isOrganizer: false,
          avatarColor: "from-pink-500 to-rose-600",
          isOnline: true,
          badges: ["Pitch 60s"],
        },
        {
          id: "p-user-3",
          name: "Lucas Duarte",
          initials: "LU",
          role: "Participante Confirmado",
          isOrganizer: false,
          avatarColor: "from-emerald-500 to-teal-600",
          isOnline: true,
          badges: ["Iniciante"],
        },
        {
          id: "p-user-4",
          name: "Beatriz Costa",
          initials: "BC",
          role: "Participante Confirmada",
          isOrganizer: false,
          avatarColor: "from-cyan-500 to-blue-600",
          isOnline: false,
        },
      ],
      messages: [
        {
          id: `pin-${projectId}-1`,
          projectId,
          sender: event.organizer.name,
          initials: event.organizer.initials || "FM",
          role: "Organizador",
          isOrganizer: true,
          text: `📢 BEM-VINDOS AO PROJETO "${event.title.toUpperCase()}"! Este é o canal direto para tirar dúvidas, receber avisos oficiais, votar em temas e interagir com toda a comunidade antes e durante o encontro.`,
          timestamp: "Hoje às 09:30",
          kind: "announcement",
          isPinned: true,
          reactions: [
            { emoji: "🔥", count: 18, users: ["Marina Alves", "Lucas Duarte", "Você"] },
            { emoji: "👏", count: 14, users: ["Carlos Eduardo", "Beatriz Costa"] },
            { emoji: "❤️", count: 9, users: ["Você", "Marina Alves"] },
          ],
        },
        {
          id: `msg-${projectId}-2`,
          projectId,
          sender: event.organizer.name,
          initials: event.organizer.initials || "FM",
          role: "Organizador",
          isOrganizer: true,
          text: "Compartilhando com vocês a apostila preparatória e o cronograma detalhado das dinâmicas práticas:",
          timestamp: "Hoje às 10:15",
          kind: "attachment",
          attachment: {
            name: "Guia_Pratico_Oratoria_e_Presenca_Palco.pdf",
            size: "3.4 MB",
            type: "pdf",
          },
          reactions: [
            { emoji: "💡", count: 12, users: ["Você", "Lucas Duarte"] },
            { emoji: "👍", count: 8, users: ["Marina Alves"] },
          ],
        },
        {
          id: `poll-${projectId}-1`,
          projectId,
          sender: event.organizer.name,
          initials: event.organizer.initials || "FM",
          role: "Organizador",
          isOrganizer: true,
          text: "Qual destas dinâmicas você mais gostaria de praticar com feedback ao vivo?",
          timestamp: "Hoje às 11:00",
          kind: "poll",
          reactions: [{ emoji: "📊", count: 7, users: ["Você"] }],
          poll: {
            id: `poll-item-${projectId}-1`,
            question: "Qual dinâmica você quer priorizar no encontro?",
            createdBy: event.organizer.name,
            isOrganizer: true,
            totalVotes: 32,
            options: [
              { text: "Pitch de Impacto (60s a 90s)", votes: 16, votedUserIds: ["user-1", "user-2"] },
              { text: "Técnicas de Improviso com Palavras Surpresa", votes: 11, votedUserIds: ["user-3"] },
              { text: "Controle de Ansiedade e Respiração no Palco", votes: 5, votedUserIds: [] },
            ],
          },
        },
        {
          id: `q-${projectId}-1`,
          projectId,
          sender: "Lucas Duarte",
          initials: "LU",
          role: "Participante",
          isOrganizer: false,
          text: "Olá organizador! Quem for iniciante e nunca falou em público pode participar apenas como ouvinte no início para se sentir confortável?",
          timestamp: "Hoje às 11:45",
          kind: "question",
          isQuestionAnswered: true,
          reactions: [{ emoji: "❤️", count: 5, users: ["Marina Alves", "Você"] }],
          organizerAnswer: {
            text: "Com certeza, Lucas! Nosso ambiente é 100% acolhedor e seguro. Você pode começar assistindo e, quando se sentir pronto, subir ao palco para sua primeira fala curta sem nenhuma pressão! 🌟",
            answeredBy: event.organizer.name,
            timestamp: "Hoje às 11:52",
          },
        },
        {
          id: `voice-${projectId}-1`,
          projectId,
          sender: event.organizer.name,
          initials: event.organizer.initials || "FM",
          role: "Organizador",
          isOrganizer: true,
          text: "Áudio do Organizador: Dicas rápidas de aquecimento vocal para você fazer antes de entrar na sala!",
          timestamp: "Hoje às 12:20",
          kind: "voice",
          voiceDuration: "0:38",
          reactions: [
            { emoji: "🔥", count: 11, users: ["Você", "Marina Alves"] },
            { emoji: "👏", count: 9, users: ["Lucas Duarte"] },
          ],
        },
        {
          id: `msg-${projectId}-3`,
          projectId,
          sender: "Marina Alves",
          initials: "MA",
          role: "Participante",
          isOrganizer: false,
          text: "Muito empolgada para o encontro! Já estou preparando meu pitch de 90 segundos 🚀",
          timestamp: "Hoje às 13:10",
          kind: "normal",
          reactions: [{ emoji: "🔥", count: 6, users: ["Você", event.organizer.name] }],
        },
      ],
    };
  }

  // Check if it's a room
  const room = MOCK_ROOMS.find((r) => r.id === projectId) || MOCK_ROOMS[0];
  return {
    projectId,
    projectTitle: room.name,
    category: room.category,
    type: "room",
    organizer: {
      name: room.host.name,
      initials: room.host.initials,
      role: room.host.role || "Host & Mentor da Sala",
      company: "Fale+ Live Hub",
      avatarColor: "from-blue-600 to-indigo-600",
    },
    pinnedMessageId: `pin-room-${projectId}-1`,
    participants: [
      {
        id: "p-host-room",
        name: room.host.name,
        initials: room.host.initials,
        role: "Host & Mediador",
        isOrganizer: true,
        avatarColor: "from-blue-600 to-indigo-600",
        isOnline: true,
        badges: ["Host", "Moderador"],
      },
      {
        id: "p-curr-user",
        name: CURRENT_USER.name,
        initials: CURRENT_USER.initials,
        role: "Orador",
        isOrganizer: false,
        avatarColor: "from-purple-600 to-indigo-600",
        isOnline: true,
      },
      ...room.participants.map((p, idx) => ({
        id: p.id || `p-${idx}`,
        name: p.name,
        initials: p.initials,
        role: p.role,
        isOrganizer: p.role === "Host",
        avatarColor: "from-slate-600 to-slate-800",
        isOnline: p.isOnline,
      })),
    ],
    messages: [
      {
        id: `pin-room-${projectId}-1`,
        projectId,
        sender: room.host.name,
        initials: room.host.initials,
        role: "Host da Sala",
        isOrganizer: true,
        text: `🎯 Regras de Convivência na Sala "${room.name}": Discursos de até 3 minutos, microfone mutado durante a fala do colega e feedbacks construtivos no chat!`,
        timestamp: "Hoje às 10:00",
        kind: "announcement",
        isPinned: true,
        reactions: [{ emoji: "👍", count: 8, users: ["Você"] }],
      },
      {
        id: `msg-room-${projectId}-2`,
        projectId,
        sender: room.host.name,
        initials: room.host.initials,
        role: "Host da Sala",
        isOrganizer: true,
        text: "Quem gostaria de ser o próximo a subir ao palco para treino de pitch? Podem levantar a mão ou responder aqui.",
        timestamp: "Hoje às 10:05",
        kind: "normal",
        reactions: [{ emoji: "✋", count: 4, users: ["Você"] }],
      },
    ],
  };
}

export function getProjectChatData(projectId: string): ProjectChatData {
  if (typeof window === "undefined") {
    return getSeedDataForProject(projectId);
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${projectId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading project chat data:", err);
  }

  const seed = getSeedDataForProject(projectId);
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${projectId}`, JSON.stringify(seed));
  } catch (err) {
    console.error("Error saving seed project chat data:", err);
  }
  return seed;
}

export function saveProjectChatData(data: ProjectChatData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${data.projectId}`, JSON.stringify(data));
    // Dispatch custom event for reactive listeners if needed
    window.dispatchEvent(new CustomEvent("fale_mais_chat_update", { detail: { projectId: data.projectId } }));
  } catch (err) {
    console.error("Error persisting project chat data:", err);
  }
}

export interface SendMessageParams {
  projectId: string;
  senderName: string;
  initials: string;
  role: string;
  isOrganizer: boolean;
  avatarColor?: string;
  text: string;
  kind?: "normal" | "announcement" | "question" | "voice" | "poll" | "attachment";
  voiceDuration?: string;
  attachment?: {
    name: string;
    size: string;
    type: "pdf" | "slides" | "link" | "image";
    url?: string;
  };
  poll?: {
    question: string;
    options: string[];
  };
}

export function sendProjectMessage(params: SendMessageParams): ChatMessage {
  const current = getProjectChatData(params.projectId);
  const now = new Date();
  const timeStr = `Hoje às ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  let createdPoll: ChatPoll | undefined;
  if (params.poll) {
    createdPoll = {
      id: `poll-${Date.now()}`,
      question: params.poll.question,
      createdBy: params.senderName,
      isOrganizer: params.isOrganizer,
      totalVotes: 0,
      options: params.poll.options.map((opt) => ({
        text: opt,
        votes: 0,
        votedUserIds: [],
      })),
    };
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    projectId: params.projectId,
    sender: params.senderName,
    senderId: CURRENT_USER.id,
    initials: params.initials,
    avatarColor: params.avatarColor || (params.isOrganizer ? "from-amber-500 to-orange-600" : "from-blue-600 to-indigo-600"),
    role: params.role,
    isOrganizer: params.isOrganizer,
    isMe: true,
    text: params.text,
    timestamp: timeStr,
    kind: params.kind || (params.poll ? "poll" : params.isOrganizer ? "announcement" : "normal"),
    reactions: [],
    voiceDuration: params.voiceDuration,
    attachment: params.attachment,
    poll: createdPoll,
  };

  const updatedData: ProjectChatData = {
    ...current,
    messages: [...current.messages, newMsg],
  };

  saveProjectChatData(updatedData);
  return newMsg;
}

export function toggleReaction(projectId: string, messageId: string, emoji: string, userName = "Você"): ProjectChatData {
  const current = getProjectChatData(projectId);
  const updatedMessages = current.messages.map((msg) => {
    if (msg.id !== messageId) return msg;

    const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
    if (!existingReaction) {
      return {
        ...msg,
        reactions: [...msg.reactions, { emoji, count: 1, users: [userName] }],
      };
    }

    const hasUserReacted = existingReaction.users.includes(userName);
    let updatedReactions: ChatReaction[];
    if (hasUserReacted) {
      const nextUsers = existingReaction.users.filter((u) => u !== userName);
      if (nextUsers.length === 0) {
        updatedReactions = msg.reactions.filter((r) => r.emoji !== emoji);
      } else {
        updatedReactions = msg.reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count - 1, users: nextUsers } : r
        );
      }
    } else {
      updatedReactions = msg.reactions.map((r) =>
        r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, userName] } : r
      );
    }

    return { ...msg, reactions: updatedReactions };
  });

  const nextData = { ...current, messages: updatedMessages };
  saveProjectChatData(nextData);
  return nextData;
}

export function togglePinMessage(projectId: string, messageId: string): ProjectChatData {
  const current = getProjectChatData(projectId);
  const isCurrentlyPinned = current.pinnedMessageId === messageId;
  const nextPinnedId = isCurrentlyPinned ? undefined : messageId;

  const updatedMessages = current.messages.map((m) => ({
    ...m,
    isPinned: m.id === nextPinnedId,
  }));

  const nextData: ProjectChatData = {
    ...current,
    pinnedMessageId: nextPinnedId,
    messages: updatedMessages,
  };
  saveProjectChatData(nextData);
  return nextData;
}

export function voteOnPoll(projectId: string, messageId: string, optionIndex: number, userId = CURRENT_USER.id): ProjectChatData {
  const current = getProjectChatData(projectId);
  const updatedMessages = current.messages.map((msg) => {
    if (msg.id !== messageId || !msg.poll) return msg;

    const poll = msg.poll;
    // Check if user already voted in this poll
    let userVotedOptionIndex = -1;
    poll.options.forEach((opt, idx) => {
      if (opt.votedUserIds.includes(userId)) {
        userVotedOptionIndex = idx;
      }
    });

    const updatedOptions = poll.options.map((opt, idx) => {
      let nextVoted = [...opt.votedUserIds];
      let nextVotes = opt.votes;

      if (idx === userVotedOptionIndex && idx !== optionIndex) {
        // Remove previous vote
        nextVoted = nextVoted.filter((id) => id !== userId);
        nextVotes = Math.max(0, nextVotes - 1);
      }

      if (idx === optionIndex && !nextVoted.includes(userId)) {
        // Add new vote
        nextVoted.push(userId);
        nextVotes += 1;
      }

      return {
        ...opt,
        votes: nextVotes,
        votedUserIds: nextVoted,
      };
    });

    const totalVotes = updatedOptions.reduce((acc, curr) => acc + curr.votes, 0);

    return {
      ...msg,
      poll: {
        ...poll,
        options: updatedOptions,
        totalVotes,
      },
    };
  });

  const nextData = { ...current, messages: updatedMessages };
  saveProjectChatData(nextData);
  return nextData;
}

export function answerProjectQuestion(
  projectId: string,
  questionMessageId: string,
  answerText: string,
  answeredByName: string
): ProjectChatData {
  const current = getProjectChatData(projectId);
  const now = new Date();
  const timeStr = `Hoje às ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const updatedMessages = current.messages.map((msg) => {
    if (msg.id !== questionMessageId) return msg;
    return {
      ...msg,
      isQuestionAnswered: true,
      organizerAnswer: {
        text: answerText,
        answeredBy: answeredByName,
        timestamp: timeStr,
      },
    };
  });

  const nextData = { ...current, messages: updatedMessages };
  saveProjectChatData(nextData);
  return nextData;
}

export function generateOrganizerSimulatedReply(projectId: string, userMessageText: string): Promise<ChatMessage> {
  return new Promise((resolve) => {
    const data = getProjectChatData(projectId);
    const org = data.organizer;

    setTimeout(() => {
      const now = new Date();
      const timeStr = `Hoje às ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      // Generate contextual reply
      let replyContent = "Obrigado pela mensagem! Nossa equipe e palestrantes estão acompanhando tudo para garantir a melhor experiência de oratória para vocês.";
      const lower = userMessageText.toLowerCase();

      if (lower.includes("dúvida") || lower.includes("como") || lower.includes("iniciante") || lower.includes("medo")) {
        replyContent = `Excelente pergunta! No projeto "${data.projectTitle}", teremos dinâmicas graduais pensadas exatamente para destravar a fala com total segurança e feedback respeitoso. Conte conosco! 🌟`;
      } else if (lower.includes("horário") || lower.includes("onde") || lower.includes("local") || lower.includes("chegar")) {
        replyContent = "Recomendamos chegar ou entrar na sala com 10 minutos de antecedência para ajustarmos o áudio e garantir seu lugar no palco aberto! ⏱️";
      } else if (lower.includes("slide") || lower.includes("material") || lower.includes("pdf")) {
        replyContent = "Todos os materiais e slides de apoio já estão disponíveis na aba de Avisos e Anexos desta sala de bate-papo! 📄";
      } else if (lower.includes("pitch") || lower.includes("apresentar") || lower.includes("improviso")) {
        replyContent = "Sensacional! Vamos reservar uma rodada de feedbacks após a sua apresentação com foco em dicção, ritmo e linguagem corporal. 🎯";
      }

      const simulatedMsg: ChatMessage = {
        id: `msg-auto-rep-${Date.now()}`,
        projectId,
        sender: org.name,
        initials: org.initials,
        role: "Organizador",
        avatarColor: org.avatarColor || "from-amber-500 to-orange-600",
        isOrganizer: true,
        isMe: false,
        text: replyContent,
        timestamp: timeStr,
        kind: "normal",
        reactions: [{ emoji: "👏", count: 2, users: ["Marina Alves", "Lucas Duarte"] }],
      };

      const currentLatest = getProjectChatData(projectId);
      const updated = {
        ...currentLatest,
        messages: [...currentLatest.messages, simulatedMsg],
      };
      saveProjectChatData(updated);
      resolve(simulatedMsg);
    }, 1800);
  });
}
