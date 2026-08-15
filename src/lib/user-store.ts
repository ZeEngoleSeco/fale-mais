import { useState, useEffect } from "react";
import { type UserProfile } from "@/data/mock-data";

const STORAGE_USER_KEY = "fale_mais_user_profile";
const STORAGE_USERS_LIST_KEY = "fale_mais_all_users_list";
const EVENT_KEY = "fale_mais_user_update";

const GRADIENT_COLORS = [
  "from-blue-600 to-indigo-600",
  "from-violet-600 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-600",
];

function calculateInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "FM";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function nameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "Usuário";
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getAllUsers(): UserProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_USERS_LIST_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading users list from localStorage", e);
  }
  return [];
}

export function saveUsersList(users: UserProfile[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Error saving users list to localStorage", e);
    }
  }
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading user from localStorage", e);
  }
  return null;
}

export function saveUser(user: UserProfile) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      const list = getAllUsers();
      const idx = list.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (idx >= 0) {
        list[idx] = user;
      } else {
        list.push(user);
      }
      saveUsersList(list);
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch (e) {
      console.error("Error saving user to localStorage", e);
    }
  }
}

export function registerNewUser(
  name: string,
  email: string,
  role = "Orador Iniciante",
  bio = "Membro da comunidade Fale+ pronto para desenvolver a comunicação e vencer o palco."
): UserProfile {
  const cleanName = name.trim() || nameFromEmail(email) || "Novo Usuário";
  const cleanEmail = email.trim().toLowerCase() || "usuario@exemplo.com";
  const colorIndex = Math.floor(Math.random() * GRADIENT_COLORS.length);

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    role: role.trim(),
    level: 1,
    xp: 0,
    xpNextLevel: 100,
    initials: calculateInitials(cleanName),
    avatarColor: GRADIENT_COLORS[colorIndex],
    bio: bio.trim(),
    streakDays: 1,
    stats: {
      presentations: 0,
      roomsCreated: 0,
      achievementsCount: 1,
      hoursPracticed: 0,
      averageScore: 0,
    },
    badges: [
      {
        id: "badge-welcome",
        title: "Primeiro Passo",
        description: "Criou sua conta na plataforma Fale+ e iniciou a jornada.",
        icon: "Sparkles",
        unlocked: true,
        unlockedAt: "Hoje",
      },
      {
        id: "badge-1",
        title: "Primeiro Palco",
        description: "Complete sua 1ª apresentação ao vivo em uma sala pública.",
        icon: "Mic",
        unlocked: false,
      },
      {
        id: "badge-2",
        title: "Sequência de Ouro",
        description: "Pratique por 7 dias consecutivos com o mentor de IA.",
        icon: "Flame",
        unlocked: false,
      },
      {
        id: "badge-3",
        title: "Mestre do Pitch",
        description: "Obtenha nota superior a 9.0 em 5 treinos de pitch de 60 segundos.",
        icon: "Trophy",
        unlocked: false,
      },
    ],
  };

  saveUser(newUser);
  return newUser;
}

export function loginWithEmail(email: string, password?: string): UserProfile {
  const cleanEmail = email.trim().toLowerCase();
  const all = getAllUsers();
  const existing = all.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    saveUser(existing);
    return existing;
  }

  // Create new active profile from the email
  const derivedName = nameFromEmail(cleanEmail);
  return registerNewUser(derivedName, cleanEmail);
}

export function updateUserName(newName: string, role?: string, bio?: string): UserProfile {
  const current = getStoredUser() || registerNewUser(newName, "usuario@exemplo.com");
  const initials = calculateInitials(newName);
  const updated: UserProfile = {
    ...current,
    name: newName.trim() || current.name,
    initials,
    role: role !== undefined ? role.trim() || current.role : current.role,
    bio: bio !== undefined ? bio.trim() : current.bio,
  };
  saveUser(updated);
  return updated;
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch (e) {
      console.error("Error logging out", e);
    }
  }
}

// Fallback user template if nothing is stored
const DEFAULT_INITIAL_USER: UserProfile = {
  id: "user-default",
  name: "Visitante",
  email: "visitante@fale-mais.com",
  role: "Orador em Desenvolvimento",
  level: 1,
  xp: 0,
  xpNextLevel: 100,
  initials: "VI",
  avatarColor: "from-blue-600 to-indigo-600",
  bio: "Conhecendo a plataforma Fale+ para aprimorar comunicação.",
  streakDays: 1,
  stats: {
    presentations: 0,
    roomsCreated: 0,
    achievementsCount: 1,
    hoursPracticed: 0,
    averageScore: 0,
  },
  badges: [
    {
      id: "badge-welcome",
      title: "Primeiro Passo",
      description: "Criou sua conta na plataforma Fale+ e iniciou a jornada.",
      icon: "Sparkles",
      unlocked: true,
      unlockedAt: "Hoje",
    },
  ],
};

export function useCurrentUser(): {
  user: UserProfile;
  allUsers: UserProfile[];
  updateName: (newName: string, role?: string, bio?: string) => void;
  setUser: (user: UserProfile) => void;
  registerUser: (name: string, email: string, role?: string, bio?: string) => UserProfile;
  loginUser: (email: string, password?: string) => UserProfile;
  logout: () => void;
} {
  const [user, setUserState] = useState<UserProfile>(() => getStoredUser() || DEFAULT_INITIAL_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(getAllUsers);

  useEffect(() => {
    const handleUpdate = () => {
      setUserState(getStoredUser() || DEFAULT_INITIAL_USER);
      setAllUsers(getAllUsers());
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateName = (newName: string, role?: string, bio?: string) => {
    const updated = updateUserName(newName, role, bio);
    setUserState(updated);
  };

  const setUser = (newUser: UserProfile) => {
    saveUser(newUser);
    setUserState(newUser);
  };

  const registerUser = (name: string, email: string, role?: string, bio?: string) => {
    const newUser = registerNewUser(name, email, role, bio);
    setUserState(newUser);
    return newUser;
  };

  const loginUser = (email: string, password?: string) => {
    const logged = loginWithEmail(email, password);
    setUserState(logged);
    return logged;
  };

  const logout = () => {
    logoutUser();
    setUserState(DEFAULT_INITIAL_USER);
  };

  return { user, allUsers, updateName, setUser, registerUser, loginUser, logout };
}
