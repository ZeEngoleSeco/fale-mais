export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  initials: string;
  avatarColor: string;
  bio: string;
  streakDays: number;
  stats: {
    presentations: number;
    roomsCreated: number;
    achievementsCount: number;
    hoursPracticed: number;
    averageScore: number;
  };
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }>;
}

export interface RoomItem {
  id: string;
  name: string;
  desc: string;
  category: "Pitch" | "Improviso" | "Corporativo" | "Bem-estar" | "Storytelling" | "Debate";
  peopleCount: number;
  maxPeople: number;
  isPrivate: boolean;
  isLive: boolean;
  host: {
    name: string;
    initials: string;
    role: string;
  };
  currentSpeaker?: {
    name: string;
    initials: string;
    topic: string;
    turn: number;
    timeRemaining: string;
  };
  participants: Array<{
    id: string;
    name: string;
    initials: string;
    role: "Host" | "Orador" | "Ouvinte";
    isOnline: boolean;
    hasHandRaised?: boolean;
    isMuted?: boolean;
  }>;
  recentMessages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    isMe?: boolean;
  }>;
}

export interface EventItem {
  id: string;
  title: string;
  desc: string;
  place: string;
  date: string;
  fullDate: string;
  time: string;
  confirmedCount: number;
  maxCapacity: number;
  kind: "Online" | "Presencial";
  category: "Workshop" | "Meetup" | "Pitch" | "Masterclass";
  isFeatured?: boolean;
  organizer: {
    name: string;
    initials: string;
    eventsHeld: number;
  };
  speakers: Array<{
    name: string;
    role: string;
    company: string;
  }>;
  agenda: Array<{
    time: string;
    activity: string;
  }>;
}

export interface ExerciseItem {
  id: string;
  name: string;
  desc: string;
  category: "Improviso" | "Pitch" | "Respiração" | "Dicção" | "Expressão";
  duration: string;
  level: "Iniciante" | "Médio" | "Avançado";
  instructions: string[];
  tips: string[];
  completionsCount: number;
}

export interface AIHistoryItem {
  id: string;
  date: string;
  type: string;
  duration: string;
  score: number;
  strengths: string[];
  improvements: string[];
  feedbackSummary: string;
}

export interface InsightMetric {
  label: string;
  value: number;
  status: "excelente" | "bom" | "atencao";
  description: string;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-1",
    name: "Ana Lima",
    email: "ana.lima@exemplo.com",
    role: "Oradora em Evolução",
    level: 7,
    xp: 720,
    xpNextLevel: 1000,
    initials: "AL",
    avatarColor: "from-blue-600 to-indigo-600",
    bio: "Gerente de Projetos focada em aprimorar oratória executiva, pitches e liderança inspiradora.",
    streakDays: 4,
    stats: {
      presentations: 24,
      roomsCreated: 6,
      achievementsCount: 12,
      hoursPracticed: 18.5,
      averageScore: 8.8,
    },
    badges: [
      {
        id: "badge-1",
        title: "Primeiro Palco",
        description: "Completou a 1ª apresentação ao vivo em uma sala pública.",
        icon: "Mic",
        unlocked: true,
        unlockedAt: "10 Jan 2026",
      },
      {
        id: "badge-2",
        title: "Sequência de Ouro",
        description: "Praticou por 7 dias consecutivos com o mentor de IA.",
        icon: "Flame",
        unlocked: true,
        unlockedAt: "28 Jan 2026",
      },
      {
        id: "badge-3",
        title: "Mestre do Pitch",
        description: "Obteve nota superior a 9.0 em 5 treinos de pitch de 60 segundos.",
        icon: "Trophy",
        unlocked: true,
        unlockedAt: "05 Fev 2026",
      },
      {
        id: "badge-4",
        title: "Voz Serena",
        description: "Completou 10 exercícios de respiração e controle da ansiedade.",
        icon: "Wind",
        unlocked: true,
        unlockedAt: "11 Fev 2026",
      },
      {
        id: "badge-5",
        title: "Líder Comunitário",
        description: "Criou e mediou 5 salas com mais de 10 participantes.",
        icon: "Users",
        unlocked: false,
      },
      {
        id: "badge-6",
        title: "Improviso Ágil",
        description: "Fale por 2 minutos sobre 5 temas surpresa sem pausas longas.",
        icon: "Sparkles",
        unlocked: false,
      },
    ],
  },
  {
    id: "user-2",
    name: "Carlos Eduardo",
    email: "carlos.edu@exemplo.com",
    role: "Mentor de Oratória & TEDx Speaker",
    level: 12,
    xp: 2400,
    xpNextLevel: 3000,
    initials: "CE",
    avatarColor: "from-violet-600 to-purple-600",
    bio: "Palestrante profissional com +10 anos preparando executivos para discursos marcantes.",
    streakDays: 14,
    stats: {
      presentations: 89,
      roomsCreated: 32,
      achievementsCount: 22,
      hoursPracticed: 64.0,
      averageScore: 9.6,
    },
    badges: [],
  },
  {
    id: "user-3",
    name: "Lucas Duarte",
    email: "lucas.duarte@exemplo.com",
    role: "Iniciante Corajoso",
    level: 3,
    xp: 290,
    xpNextLevel: 450,
    initials: "LU",
    avatarColor: "from-emerald-500 to-teal-600",
    bio: "Desenvolvedor buscando vencer a timidez para apresentar demos e dailies técnicas.",
    streakDays: 2,
    stats: {
      presentations: 7,
      roomsCreated: 1,
      achievementsCount: 4,
      hoursPracticed: 4.2,
      averageScore: 7.5,
    },
    badges: [],
  },
];

export const CURRENT_USER = MOCK_USERS[0];

export const MOCK_ROOMS: RoomItem[] = [
  {
    id: "1",
    name: "Pitch para Investidores & Startups",
    desc: "Prática semanal de pitchs curtos de 60s a 3min com rodada de feedback instantâneo.",
    category: "Pitch",
    peopleCount: 14,
    maxPeople: 20,
    isPrivate: false,
    isLive: true,
    host: { name: "Carlos Eduardo", initials: "CE", role: "Mentor" },
    currentSpeaker: {
      name: "João Ribeiro",
      initials: "JR",
      topic: "Pitch de Solução SaaS B2B · Turno 3",
      turn: 3,
      timeRemaining: "01:45",
    },
    participants: [
      { id: "p1", name: "Carlos Eduardo", initials: "CE", role: "Host", isOnline: true },
      { id: "p2", name: "João Ribeiro", initials: "JR", role: "Orador", isOnline: true },
      { id: "p3", name: "Marina Alves", initials: "MA", role: "Ouvinte", isOnline: true, hasHandRaised: true },
      { id: "p4", name: "Lucas Duarte", initials: "LU", role: "Ouvinte", isOnline: true },
      { id: "p5", name: "Camila Souza", initials: "CA", role: "Ouvinte", isOnline: true },
      { id: "p6", name: "Pedro Henrique", initials: "PE", role: "Ouvinte", isOnline: true },
      { id: "p7", name: "Beatriz Costa", initials: "BC", role: "Ouvinte", isOnline: true },
    ],
    recentMessages: [
      { id: "m1", sender: "Marina Alves", text: "Excelente gancho inicial na proposta de valor! 🚀", time: "Agora" },
      { id: "m2", sender: "Lucas Duarte", text: "A dicção ficou super clara, parabéns!", time: "Há 1 min" },
      { id: "m3", sender: "Você", text: "Gostei muito da transição para a métrica de retenção 🙌", time: "Há 2 min", isMe: true },
      { id: "m4", sender: "Carlos Eduardo", text: "Lembre-se de fechar com o 'Call to Action' forte.", time: "Há 3 min" },
    ],
  },
  {
    id: "2",
    name: "Vencendo a Ansiedade & Medo de Falar",
    desc: "Ambiente acolhedor com exercícios guiados de respiração, postura e primeiros passos.",
    category: "Bem-estar",
    peopleCount: 28,
    maxPeople: 35,
    isPrivate: false,
    isLive: true,
    host: { name: "Dra. Juliana Prado", initials: "JP", role: "Psicóloga & Facilitadora" },
    currentSpeaker: {
      name: "Camila Souza",
      initials: "CA",
      topic: "Compartilhando superação do nervosismo em reuniões",
      turn: 2,
      timeRemaining: "02:10",
    },
    participants: [
      { id: "p1", name: "Dra. Juliana Prado", initials: "JP", role: "Host", isOnline: true },
      { id: "p2", name: "Camila Souza", initials: "CA", role: "Orador", isOnline: true },
      { id: "p3", name: "Pedro Henrique", initials: "PE", role: "Ouvinte", isOnline: true },
      { id: "p4", name: "Beatriz Costa", initials: "BC", role: "Ouvinte", isOnline: true },
    ],
    recentMessages: [
      { id: "m1", sender: "Dra. Juliana Prado", text: "Respirem fundo: 4s inspirando, 4s segurando, 4s soltando 🌿", time: "Há 2 min" },
      { id: "m2", sender: "Pedro Henrique", text: "Essa técnica me ajudou muito hoje antes de começar!", time: "Há 4 min" },
    ],
  },
  {
    id: "3",
    name: "Improviso Livre: Temas Surpresa em 60s",
    desc: "A roleta sorteia uma palavra ou situação inusitada e você tem 1 minuto para discursar.",
    category: "Improviso",
    peopleCount: 19,
    maxPeople: 25,
    isPrivate: false,
    isLive: true,
    host: { name: "Felipe Santos", initials: "FS", role: "Comediante & Instrutor" },
    currentSpeaker: {
      name: "Marina Alves",
      initials: "MA",
      topic: "Tema sorteado: 'Por que o café move o universo?'",
      turn: 5,
      timeRemaining: "00:42",
    },
    participants: [
      { id: "p1", name: "Felipe Santos", initials: "FS", role: "Host", isOnline: true },
      { id: "p2", name: "Marina Alves", initials: "MA", role: "Orador", isOnline: true },
      { id: "p3", name: "Lucas Duarte", initials: "LU", role: "Ouvinte", isOnline: true, hasHandRaised: true },
    ],
    recentMessages: [
      { id: "m1", sender: "Felipe Santos", text: "Mandou muito bem na história do barista! 😂", time: "Há 1 min" },
      { id: "m2", sender: "Você", text: "Sensacional o improviso!", time: "Há 2 min", isMe: true },
    ],
  },
  {
    id: "4",
    name: "Sala Fechada — Liderança Alpha Corporativa",
    desc: "Treino exclusivo de comunicação executiva, reuniões de diretoria e alinhamento estratégico.",
    category: "Corporativo",
    peopleCount: 8,
    maxPeople: 10,
    isPrivate: true,
    isLive: false,
    host: { name: "Roberto Silveira", initials: "RS", role: "Diretor Executivo" },
    participants: [
      { id: "p1", name: "Roberto Silveira", initials: "RS", role: "Host", isOnline: true },
      { id: "p2", name: "Ana Lima", initials: "AL", role: "Orador", isOnline: true },
    ],
    recentMessages: [],
  },
  {
    id: "5",
    name: "Storytelling Marcante: A Jornada do Herói",
    desc: "Como transformar dados e apresentações monótonas em histórias magnéticas e inesquecíveis.",
    category: "Storytelling",
    peopleCount: 22,
    maxPeople: 30,
    isPrivate: false,
    isLive: true,
    host: { name: "Helena Vaz", initials: "HV", role: "Roteirista" },
    participants: [
      { id: "p1", name: "Helena Vaz", initials: "HV", role: "Host", isOnline: true },
      { id: "p2", name: "Ana Lima", initials: "AL", role: "Ouvinte", isOnline: true },
    ],
    recentMessages: [],
  },
  {
    id: "6",
    name: "Mesa de Debates & Oratória Sob Pressão",
    desc: "Pratique respostas rápidas, argumentação estruturada e elegância em momentos de confronto.",
    category: "Debate",
    peopleCount: 16,
    maxPeople: 20,
    isPrivate: false,
    isLive: false,
    host: { name: "Prof. André Martins", initials: "AM", role: "Advogado & Mediador" },
    participants: [],
    recentMessages: [],
  },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "1",
    title: "Meetup: Falar em Público sem Medo",
    desc: "Uma noite com dinâmicas práticas no palco, técnicas de destravamento e networking real.",
    place: "Av. Paulista, 1000 — São Paulo, SP",
    date: "Sáb, 15 Fev",
    fullDate: "Sábado, 15 de Fevereiro de 2026",
    time: "19h00 às 22h00",
    confirmedCount: 42,
    maxCapacity: 60,
    kind: "Presencial",
    category: "Meetup",
    isFeatured: true,
    organizer: {
      name: "Comunidade Fale+ SP",
      initials: "FM",
      eventsHeld: 18,
    },
    speakers: [
      { name: "Carlos Eduardo", role: "Palestrante TEDx", company: "Fale+" },
      { name: "Dra. Juliana Prado", role: "Psicóloga Especialista em Fobia Social", company: "Instituto Mente Serena" },
    ],
    agenda: [
      { time: "19h00", activity: "Credenciamento & Welcome Coffee" },
      { time: "19h30", activity: "Palestra de Abertura: Os 3 Pilares da Presença no Palco" },
      { time: "20h15", activity: "Dinâmica do Palco Aberto: Micro-discursos de 90 segundos" },
      { time: "21h15", activity: "Sessão de Feedbacks Construtivos & Rodada de Networking" },
    ],
  },
  {
    id: "2",
    title: "Masterclass Online: Storytelling para Líderes",
    desc: "Aprenda a estruturar discursos que conectam pela emoção e convertem ideias em ação.",
    place: "Online · Transmissão via Fale+ Live",
    date: "Qua, 19 Fev",
    fullDate: "Quarta-feira, 19 de Fevereiro de 2026",
    time: "20h00 às 21h30",
    confirmedCount: 156,
    maxCapacity: 300,
    kind: "Online",
    category: "Masterclass",
    isFeatured: false,
    organizer: {
      name: "Fale+ Academy",
      initials: "FA",
      eventsHeld: 34,
    },
    speakers: [
      { name: "Helena Vaz", role: "Estrategista Narrativa", company: "StoryWorks" },
    ],
    agenda: [
      { time: "20h00", activity: "Abertura & Apresentação da Estrutura Narrativa em 3 Atos" },
      { time: "20h40", activity: "Estudo de Caso: Discursos que Mudaram o Mundo" },
      { time: "21h10", activity: "Perguntas & Respostas ao Vivo com a Platéia" },
    ],
  },
  {
    id: "3",
    title: "Pitch Night Rio: Startups & Oratória",
    desc: "Apresente seu negócio para uma banca avaliadora com investidores e mentores do ecossistema.",
    place: "Ipanema Hub · Rio de Janeiro, RJ",
    date: "Sex, 27 Fev",
    fullDate: "Sexta-feira, 27 de Fevereiro de 2026",
    time: "19h30 às 22h30",
    confirmedCount: 78,
    maxCapacity: 90,
    kind: "Presencial",
    category: "Pitch",
    isFeatured: false,
    organizer: {
      name: "Fale+ Rio Hub",
      initials: "FR",
      eventsHeld: 9,
    },
    speakers: [
      { name: "Rodrigo Mendonça", role: "Sócio Investidor", company: "Gavea Angels" },
    ],
    agenda: [
      { time: "19h30", activity: "Recepção & Pitch Warm-up" },
      { time: "20h00", activity: "Rodada 1: Pitches de 3 minutos" },
      { time: "21h00", activity: "Feedback dos Juízes & Premiação" },
    ],
  },
  {
    id: "4",
    title: "Workshop: Modulação de Voz & Dicção Perfeita",
    desc: "Exercícios práticos de impostação vocal, respiração diafragmática e eliminação de vícios de linguagem.",
    place: "Online · Sala Interativa",
    date: "Ter, 03 Mar",
    fullDate: "Terça-feira, 03 de Março de 2026",
    time: "19h00 às 20h30",
    confirmedCount: 94,
    maxCapacity: 120,
    kind: "Online",
    category: "Workshop",
    isFeatured: false,
    organizer: {
      name: "Fale+ Academy",
      initials: "FA",
      eventsHeld: 34,
    },
    speakers: [
      { name: "Beatriz Nogueira", role: "Fonoaudióloga & Preparadora Vocal", company: "Voz & Presença" },
    ],
    agenda: [
      { time: "19h00", activity: "Aquecimento vocal guiado" },
      { time: "19h30", activity: "Técnicas de ritmo, pausas e entonação" },
      { time: "20h15", activity: "Treino prático com voluntários" },
    ],
  },
];

export const MOCK_EXERCISES: ExerciseItem[] = [
  {
    id: "ex-1",
    name: "Improviso Relâmpago",
    desc: "Receba um tema surpresa e fale por 60 segundos com início, meio e conclusão.",
    category: "Improviso",
    duration: "1 min",
    level: "Iniciante",
    instructions: [
      "1. Leia o tema gerado na tela com calma.",
      "2. Faça uma pausa de 3 segundos antes de iniciar sua primeira frase.",
      "3. Estruture em: Problema -> Sua Opinião -> Conclusão marcante.",
    ],
    tips: [
      "Evite usar 'né', 'tipo' ou 'éee' durante as transições de raciocínio.",
      "Mantenha um tom confiante mesmo quando estiver pensando na frase seguinte.",
    ],
    completionsCount: 3840,
  },
  {
    id: "ex-2",
    name: "Pitch de Elevador (Elevator Pitch)",
    desc: "Apresente quem você é, o que faz e seu diferencial em exatamente 60 segundos.",
    category: "Pitch",
    duration: "3 min",
    level: "Médio",
    instructions: [
      "1. Apresente o problema que você resolve nos primeiros 10 segundos.",
      "2. Destaque sua proposta única de valor e métricas principais.",
      "3. Encerre com uma chamada para ação clara e inesquecível.",
    ],
    tips: [
      "Use números concretos: 'ajudei 30 clientes a aumentar a receita em 40%'.",
      "Pratique com um cronômetro visível para calibrar seu ritmo.",
    ],
    completionsCount: 2910,
  },
  {
    id: "ex-3",
    name: "Respiração 4-7-8 para Calma",
    desc: "Técnica clinicamente comprovada para desacelerar batimentos cardíacos antes de subir ao palco.",
    category: "Respiração",
    duration: "5 min",
    level: "Iniciante",
    instructions: [
      "1. Inspire pelo nariz silenciosamente contando até 4.",
      "2. Segure a respiração com os pulmões cheios contando até 7.",
      "3. Expire completamente pela boca com som de sopro contando até 8.",
      "4. Repita o ciclo por 4 vezes.",
    ],
    tips: [
      "Mantenha os ombros relaxados e a coluna ereta.",
      "Sinta a expansão do abdômen e não apenas do peito.",
    ],
    completionsCount: 5200,
  },
  {
    id: "ex-4",
    name: "Modulação de Voz & Entonação",
    desc: "Varie o volume, a velocidade e a emoção da voz para manter o público hipnotizado.",
    category: "Expressão",
    duration: "4 min",
    level: "Médio",
    instructions: [
      "1. Leia o parágrafo em tom de sussurro enigmático.",
      "2. Mude imediatamente para um tom enérgico e vibrante.",
      "3. Faça uma pausa dramática de 2 segundos antes da palavra mais importante.",
    ],
    tips: [
      "A monotonia é a maior inimiga da atenção do ouvinte.",
    ],
    completionsCount: 1840,
  },
  {
    id: "ex-5",
    name: "Simulação de Apresentação Completa",
    desc: "Apresente um tema por 10 minutos com slides simulados e perguntas surpresa da IA.",
    category: "Pitch",
    duration: "10 min",
    level: "Avançado",
    instructions: [
      "1. Apresente sua introdução capturando a atenção nos primeiros 30s.",
      "2. Desenvolva 3 pontos centrais com exemplos práticos.",
      "3. Responda a 2 perguntas imprevistas feitas pelo mentor virtual.",
    ],
    tips: [
      "Grave seu áudio e assista ao relatório de métricas pós-sessão.",
    ],
    completionsCount: 970,
  },
  {
    id: "ex-6",
    name: "Dicção Ágil com Trava-Línguas",
    desc: "Trabalhe a musculatura facial, clareza fonética e projeção vocal.",
    category: "Dicção",
    duration: "3 min",
    level: "Iniciante",
    instructions: [
      "1. Repita 'O peito do pé de Pedro é preto' aumentando a velocidade a cada repetição.",
      "2. Articule exageradamente cada sílaba sem perder a clareza.",
    ],
    tips: [
      "Abra bem a boca ao pronunciar vogais abertas.",
    ],
    completionsCount: 4100,
  },
];

export const MOCK_HISTORY: AIHistoryItem[] = [
  {
    id: "hist-1",
    date: "Hoje, 09:15",
    type: "Pitch de 60 segundos",
    duration: "1m 12s",
    score: 8.9,
    strengths: ["Excelente clareza vocal", "Uso estratégico de pausas", "Gancho inicial impactante"],
    improvements: ["Acelerou o ritmo nos últimos 15 segundos", "1 uso do vício 'éee'"],
    feedbackSummary: "Apresentação muito consistente! Sua introdução capturou atenção imediata e a modulação transmitiu autoridade.",
  },
  {
    id: "hist-2",
    date: "Ontem, 21:04",
    type: "Improviso: Tema 'Inteligência Artificial'",
    duration: "2m 30s",
    score: 8.4,
    strengths: ["Estrutura lógica clara", "Bom contato visual simulado", "Vocabulário rico"],
    improvements: ["Postura um pouco rígida no início", "Poderia ter fechado com frase de efeito"],
    feedbackSummary: "Ótima capacidade de encadear pensamentos sem pausas constrangedoras. Concluiu com segurança.",
  },
  {
    id: "hist-3",
    date: "Seg, 18:22",
    type: "Respiração & Controle de Ansiedade",
    duration: "5m 00s",
    score: 9.5,
    strengths: ["Ritmo cardíaco estabilizado", "Foco consistente durante os 4 ciclos"],
    improvements: ["Mantenha os ombros um pouco mais soltos"],
    feedbackSummary: "Sessão de relaxamento completada com louvor. Excelente prontidão para falar em público.",
  },
  {
    id: "hist-4",
    date: "Dom, 10:11",
    type: "Apresentação Executiva (Simulação)",
    duration: "9m 45s",
    score: 8.2,
    strengths: ["Domínio técnico do assunto", "Tom de voz firme e seguro"],
    improvements: ["Reduzir muletas como 'tá bom?' e 'certo?'", "Variar mais o volume em pontos-chave"],
    feedbackSummary: "Discurso profissional e bem embasado. Trabalhe a modulação para evitar momentos lineares.",
  },
  {
    id: "hist-5",
    date: "Sex, 14:05",
    type: "Dicção & Aquecimento Vocal",
    duration: "3m 30s",
    score: 9.1,
    strengths: ["Pronúncia impecável", "Velocidade progressiva sem perda de clareza"],
    improvements: ["Praticar mais consoantes oclusivas"],
    feedbackSummary: "Dicção afiada e excelente projeção para salas com platéia.",
  },
];

export const MOCK_INSIGHTS_METRICS: InsightMetric[] = [
  {
    label: "Confiança Percebida",
    value: 86,
    status: "excelente",
    description: "Postura vocal firme, assertividade nas afirmações e poucas hesitações.",
  },
  {
    label: "Velocidade da Fala",
    value: 74,
    status: "bom",
    description: "Média de 132 palavras por minuto (faixa ideal: 120 a 145 PPM).",
  },
  {
    label: "Uso de Pausas Estratégicas",
    value: 81,
    status: "excelente",
    description: "Pausas de 1 a 2 segundos após ideias centrais aumentam a retenção do público.",
  },
  {
    label: "Contato Visual & Presença",
    value: 68,
    status: "atencao",
    description: "Tente manter o olhar fixo em pontos estratégicos em vez de desviar para o chão.",
  },
  {
    label: "Clareza & Articulação",
    value: 91,
    status: "excelente",
    description: "Excelente separação de sílabas e inteligibilidade das palavras.",
  },
  {
    label: "Controle de Vícios de Linguagem",
    value: 70,
    status: "bom",
    description: "Média de apenas 1.2 muletas ('né', 'tipo', 'éee') a cada 2 minutos de fala.",
  },
];

export const MOCK_SUGGESTIONS = [
  {
    id: "sug-1",
    title: "Faça uma pausa de 2 segundos antes de responder",
    category: "Controle & Presença",
    detail: "Ao receber uma pergunta difícil, respirar antes de falar transmite serenidade e inteligência emocional.",
    icon: "Clock",
  },
  {
    id: "sug-2",
    title: "Alterne o volume da voz para criar suspense",
    category: "Modulação Vocal",
    detail: "Reduzir o tom da voz logo antes de revelar um dado surpreendente obriga a platéia a prestar o dobro de atenção.",
    icon: "Volume2",
  },
  {
    id: "sug-3",
    title: "Abra a postura corporal e destrave os braços",
    category: "Linguagem Corporal",
    detail: "Mantenha as mãos visíveis e os gestos abertos acima da linha da cintura para transmitir transparência.",
    icon: "UserCheck",
  },
  {
    id: "sug-4",
    title: "Comece sua fala com uma pergunta instigante",
    category: "Estrutura do Discurso",
    detail: "Evite começar com 'Bom dia, meu nome é...'. Comece com uma provocação: 'Você já parou para pensar quanto tempo perde por semana?'",
    icon: "Sparkles",
  },
  {
    id: "sug-5",
    title: "Pratique a técnica da respiração 4-7-8 antes do palco",
    category: "Controle da Ansiedade",
    detail: "Oxigena o cérebro, diminui a liberação de adrenalina e estabiliza o tom vocal em menos de 3 minutos.",
    icon: "Wind",
  },
  {
    id: "sug-6",
    title: "Substitua o 'né?' por silêncio intencional",
    category: "Dicção & Vícios",
    detail: "O silêncio soa sábio e reflexivo para quem ouve, enquanto o 'né' soa como insegurança ou busca por aprovação.",
    icon: "VolumeX",
  },
];
