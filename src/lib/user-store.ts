import { useState, useEffect } from "react";
import { MOCK_USERS, ALL_ACHIEVEMENTS, type UserProfile } from "@/data/mock-data";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_USER_KEY = "fale_mais_user_profile";
const STORAGE_USERS_LIST_KEY = "fale_mais_all_users_list";
const STORAGE_REMEMBER_KEY = "fale_mais_remember_me";
const STORAGE_SAVED_CREDS_KEY = "fale_mais_remembered_creds";
const EVENT_KEY = "fale_mais_user_update";

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

const GRADIENT_COLORS = [
  "from-blue-600 to-indigo-600",
  "from-violet-600 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-cyan-600",
];

export function calculateInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "FM";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function nameFromEmail(email: string): string {
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
    const seeded = MOCK_USERS.map((u) => ({ ...u, password: "123456" }));
    localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(seeded));
    return seeded;
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

export function ensureFullBadges(user: UserProfile): UserProfile {
  if (!user) return user;
  const userBadgesMap = new Map((user.badges || []).map((b) => [b.id, b]));

  const mergedBadges = ALL_ACHIEVEMENTS.map((masterBadge) => {
    const existing = userBadgesMap.get(masterBadge.id) || userBadgesMap.get(masterBadge.title);
    if (existing) {
      return {
        ...masterBadge,
        ...existing,
        unlocked: existing.unlocked ?? masterBadge.unlocked,
        unlockedAt: existing.unlockedAt || masterBadge.unlockedAt,
      };
    }
    if (user.id !== "user-1") {
      return {
        ...masterBadge,
        unlocked: masterBadge.id === "badge-welcome",
        unlockedAt: masterBadge.id === "badge-welcome" ? "Hoje" : undefined,
      };
    }
    return masterBadge;
  });

  const unlockedCount = mergedBadges.filter((b) => b.unlocked).length;

  return {
    ...user,
    badges: mergedBadges,
    stats: {
      ...user.stats,
      achievementsCount: unlockedCount,
    },
  };
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return ensureFullBadges(parsed);
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

// Convert Supabase User object into UserProfile
export function mapSupabaseUserToProfile(sbUser: any, profileData?: any): UserProfile {
  const meta = sbUser.user_metadata || {};
  const cleanName = meta.name || profileData?.name || nameFromEmail(sbUser.email || "") || "Usuário";
  const role = meta.role || profileData?.role || "Orador Iniciante";
  const bio = meta.bio || profileData?.bio || "Membro da comunidade Fale+ pronto para desenvolver a comunicação e vencer o palco.";
  const avatarColor = profileData?.avatar_color || meta.avatarColor || GRADIENT_COLORS[0];

  const profile: UserProfile = {
    id: sbUser.id,
    name: cleanName,
    email: sbUser.email || "",
    role: role,
    level: profileData?.level || 1,
    xp: profileData?.xp || 0,
    xpNextLevel: profileData?.xp_next_level || 100,
    initials: calculateInitials(cleanName),
    avatarColor: avatarColor,
    avatarUrl: meta.avatarUrl || profileData?.avatar_url,
    bio: bio,
    streakDays: profileData?.streak_days || 1,
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
        icon: "Compass",
        unlocked: true,
        unlockedAt: "Hoje",
      },
    ],
  };

  return ensureFullBadges(profile);
}

// Async Supabase Registration
export async function registerNewUserAsync(
  name: string,
  email: string,
  password?: string,
  role = "Orador Iniciante",
  bio = "Membro da comunidade Fale+ pronto para desenvolver a comunicação e vencer o palco."
): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Por favor, informe um e-mail válido." };
  }
  if (!password || password.trim().length < 6) {
    return { success: false, error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const cleanName = name.trim() || nameFromEmail(cleanEmail) || "Novo Usuário";

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: password.trim(),
    options: {
      data: {
        name: cleanName,
        role: role.trim(),
        bio: bio.trim(),
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    const userProfile = mapSupabaseUserToProfile(data.user);
    saveUser(userProfile);
    return { success: true, user: userProfile };
  }

  return { success: false, error: "Não foi possível concluir o cadastro." };
}

// Sync fallback wrapper
export function registerNewUser(
  name: string,
  email: string,
  password?: string,
  role?: string,
  bio?: string
): AuthResult {
  registerNewUserAsync(name, email, password, role, bio);
  return { success: true };
}

// Async Supabase Login
export async function loginWithEmailAsync(email: string, password?: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Por favor, informe o seu e-mail." };
  }
  if (!password) {
    return { success: false, error: "Por favor, informe a sua senha." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: password.trim(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    const userProfile = mapSupabaseUserToProfile(data.user);
    saveUser(userProfile);
    return { success: true, user: userProfile };
  }

  return { success: false, error: "Não foi possível realizar o login." };
}

// Sync fallback wrapper
export function loginWithEmail(email: string, password?: string): AuthResult {
  loginWithEmailAsync(email, password);
  return { success: true };
}

// Async Supabase Password Reset
export async function resetUserPasswordAsync(email: string, newPassword?: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: "Por favor, informe o seu e-mail cadastrado." };
  }

  if (newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: `${window.location.origin}/`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function resetUserPassword(email: string, newPassword?: string): AuthResult {
  resetUserPasswordAsync(email, newPassword);
  return { success: true };
}

// Async Supabase User Profile Update
export async function updateUserNameAsync(
  newName: string,
  role?: string,
  bio?: string,
  avatarUrl?: string | null
): Promise<UserProfile> {
  const current = getStoredUser() || DEFAULT_INITIAL_USER;
  const initials = calculateInitials(newName);

  const updatedName = newName.trim() || current.name;
  const updatedRole = role !== undefined ? role.trim() || current.role : current.role;
  const updatedBio = bio !== undefined ? bio.trim() : current.bio;

  const { data } = await supabase.auth.updateUser({
    data: {
      name: updatedName,
      role: updatedRole,
      bio: updatedBio,
      avatarUrl: avatarUrl === null ? null : (avatarUrl !== undefined ? avatarUrl : current.avatarUrl),
    },
  });

  if (data?.user) {
    const updated = mapSupabaseUserToProfile(data.user);
    saveUser(updated);
    return updated;
  }

  const fallbackUpdated: UserProfile = {
    ...current,
    name: updatedName,
    initials,
    role: updatedRole,
    bio: updatedBio,
    avatarUrl: avatarUrl === null ? undefined : (avatarUrl !== undefined ? avatarUrl : current.avatarUrl),
  };
  saveUser(fallbackUpdated);
  return fallbackUpdated;
}

export function updateUserName(
  newName: string,
  role?: string,
  bio?: string,
  avatarUrl?: string | null
): UserProfile {
  updateUserNameAsync(newName, role, bio, avatarUrl);
  const current = getStoredUser() || DEFAULT_INITIAL_USER;
  return {
    ...current,
    name: newName.trim() || current.name,
    role: role !== undefined ? role.trim() || current.role : current.role,
    bio: bio !== undefined ? bio.trim() : current.bio,
  };
}

export function saveRememberMePreference(remember: boolean, email?: string, password?: string) {
  if (typeof window === "undefined") return;
  try {
    if (remember) {
      localStorage.setItem(STORAGE_REMEMBER_KEY, "true");
      if (email && password) {
        localStorage.setItem(STORAGE_SAVED_CREDS_KEY, JSON.stringify({ email, password }));
      }
    } else {
      localStorage.removeItem(STORAGE_REMEMBER_KEY);
      localStorage.removeItem(STORAGE_SAVED_CREDS_KEY);
    }
  } catch (e) {
    console.error("Error saving remember me preference", e);
  }
}

export function getRememberMePreference(): { remember: boolean; email?: string; password?: string } {
  if (typeof window === "undefined") return { remember: false };
  try {
    const remember = localStorage.getItem(STORAGE_REMEMBER_KEY) === "true";
    const savedCreds = localStorage.getItem(STORAGE_SAVED_CREDS_KEY);
    if (remember && savedCreds) {
      const parsed = JSON.parse(savedCreds);
      return { remember: true, email: parsed.email, password: parsed.password };
    }
    return { remember };
  } catch (e) {
    console.error("Error reading remember me preference", e);
  }
  return { remember: false };
}

export async function logoutUserAsync() {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_REMEMBER_KEY);
      localStorage.removeItem(STORAGE_SAVED_CREDS_KEY);
      window.dispatchEvent(new Event(EVENT_KEY));
    } catch (e) {
      console.error("Error logging out", e);
    }
  }
}

export function logoutUser() {
  logoutUserAsync();
}

const DEFAULT_INITIAL_USER: UserProfile = ensureFullBadges({
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
  badges: ALL_ACHIEVEMENTS.map((b) => ({
    ...b,
    unlocked: b.id === "badge-welcome",
    unlockedAt: b.id === "badge-welcome" ? "Hoje" : undefined,
  })),
});

export function useCurrentUser(): {
  user: UserProfile;
  allUsers: UserProfile[];
  updateName: (newName: string, role?: string, bio?: string, avatarUrl?: string | null) => Promise<UserProfile>;
  setUser: (user: UserProfile) => void;
  registerUser: (name: string, email: string, password?: string, role?: string, bio?: string) => Promise<AuthResult>;
  loginUser: (email: string, password?: string) => Promise<AuthResult>;
  resetPassword: (email: string, newPassword?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
} {
  const [user, setUserState] = useState<UserProfile>(() => getStoredUser() || DEFAULT_INITIAL_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(getAllUsers);

  useEffect(() => {
    // 1. Initial Supabase Session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userProfile = mapSupabaseUserToProfile(session.user);
        setUserState(userProfile);
        saveUser(userProfile);
      }
    });

    // 2. Real-time auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userProfile = mapSupabaseUserToProfile(session.user);
        setUserState(userProfile);
        saveUser(userProfile);
      } else if (_event === "SIGNED_OUT") {
        setUserState(DEFAULT_INITIAL_USER);
      }
    });

    const handleUpdate = () => {
      setUserState(getStoredUser() || DEFAULT_INITIAL_USER);
      setAllUsers(getAllUsers());
    };

    window.addEventListener(EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener(EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const updateName = async (newName: string, role?: string, bio?: string, avatarUrl?: string | null) => {
    const updated = await updateUserNameAsync(newName, role, bio, avatarUrl);
    setUserState(updated);
    return updated;
  };

  const setUser = (newUser: UserProfile) => {
    saveUser(newUser);
    setUserState(newUser);
  };

  const registerUser = async (name: string, email: string, password?: string, role?: string, bio?: string) => {
    const result = await registerNewUserAsync(name, email, password, role, bio);
    if (result.success && result.user) {
      setUserState(result.user);
    }
    return result;
  };

  const loginUser = async (email: string, password?: string) => {
    const result = await loginWithEmailAsync(email, password);
    if (result.success && result.user) {
      setUserState(result.user);
    }
    return result;
  };

  const resetPassword = async (email: string, newPassword?: string) => {
    const result = await resetUserPasswordAsync(email, newPassword);
    return result;
  };

  const logout = async () => {
    await logoutUserAsync();
    setUserState(DEFAULT_INITIAL_USER);
  };

  return { user, allUsers, updateName, setUser, registerUser, loginUser, resetPassword, logout };
}
