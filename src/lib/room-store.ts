import { MOCK_ROOMS, MOCK_USERS, CURRENT_USER, type RoomItem } from "@/data/mock-data";
import { getStoredUser } from "@/lib/user-store";

const STORAGE_KEY = "fale_mais_custom_rooms";

export function getCustomRooms(): RoomItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading custom rooms:", e);
    return [];
  }
}

export function getAllRooms(): RoomItem[] {
  const customRooms = getCustomRooms();
  return [...customRooms, ...MOCK_ROOMS];
}

export function getRoomById(id: string): RoomItem | undefined {
  const all = getAllRooms();
  return all.find((r) => r.id === id);
}

export interface CreateRoomInput {
  name: string;
  desc: string;
  category: "Pitch" | "Improviso" | "Corporativo" | "Bem-estar" | "Storytelling" | "Debate";
  maxPeople: number;
  isPrivate: boolean;
  password?: string;
  hostRole?: string;
  initialParticipantUserIds?: string[];
  initialTopic?: string;
}

export function createNewRoom(input: CreateRoomInput): RoomItem {
  const customRooms = getCustomRooms();
  const roomId = `custom-room-${Date.now()}`;
  const currentUser = getStoredUser() || CURRENT_USER;

  const hostParticipant = {
    id: `p-host-${Date.now()}`,
    name: currentUser.name,
    initials: currentUser.initials,
    role: "Host" as const,
    isOnline: true,
  };

  const invitedParticipants = (input.initialParticipantUserIds || [])
    .map((userId) => {
      const u = MOCK_USERS.find((user) => user.id === userId);
      if (!u || u.id === currentUser.id) return null;
      return {
        id: `p-${u.id}-${Date.now()}`,
        name: u.name,
        initials: u.initials,
        role: "Ouvinte" as const,
        isOnline: true,
      };
    })
    .filter(Boolean) as RoomItem["participants"];

  const participants = [hostParticipant, ...invitedParticipants];

  const newRoom: RoomItem = {
    id: roomId,
    name: input.name.trim(),
    desc: input.desc.trim() || "Sala prática de oratória em tempo real.",
    category: input.category,
    peopleCount: participants.length,
    maxPeople: Math.max(participants.length, input.maxPeople || 20),
    isPrivate: input.isPrivate,
    isLive: true,
    host: {
      name: currentUser.name,
      initials: currentUser.initials,
      role: input.hostRole || "Host & Facilitador",
    },
    currentSpeaker: {
      name: currentUser.name,
      initials: currentUser.initials,
      topic: input.initialTopic || `Apresentação Inicial na sala "${input.name}"`,
      turn: 1,
      timeRemaining: "03:00",
    },
    participants,
    recentMessages: [
      {
        id: `m-init-${Date.now()}`,
        sender: currentUser.name,
        text: `Bem-vindos à sala "${input.name}"! Vamos começar nossa sessão prática de oratória. 🚀`,
        time: "Agora",
        isMe: true,
      },
    ],
  };

  const updatedCustom = [newRoom, ...customRooms];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustom));
  }

  return newRoom;
}

export function deleteCustomRoom(id: string): void {
  const customRooms = getCustomRooms();
  const updated = customRooms.filter((r) => r.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}
