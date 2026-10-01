import { supabase } from "@/integrations/supabase/client";
import { getStoredUser } from "@/lib/user-store";
import { calculateInitials } from "@/lib/user-store";

export interface RoomDB {
  id: string;
  name: string;
  description: string;
  category: string;
  max_people: number;
  is_private: boolean;
  password?: string | null;
  host_id: string;
  host_name: string;
  host_initials: string;
  is_live: boolean;
  initial_topic: string;
  people_count: number;
  created_at: string;
  updated_at: string;
}

export interface RoomMessageDB {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  sender_initials: string;
  text: string;
  created_at: string;
}

export interface RoomParticipantDB {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_initials: string;
  role: string;
  joined_at: string;
  last_seen: string;
}

export interface CreateRoomInput {
  name: string;
  description?: string;
  category: string;
  maxPeople?: number;
  isPrivate?: boolean;
  password?: string;
  initialTopic?: string;
}

/** Fetch all rooms from Supabase, ordered by newest first */
export async function fetchAllRooms(): Promise<RoomDB[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
  return (data as RoomDB[]) || [];
}

/** Fetch a single room by id */
export async function fetchRoomById(id: string): Promise<RoomDB | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    return null;
  }
  return data as RoomDB;
}

/** Create a new room in Supabase */
export async function createRoom(input: CreateRoomInput): Promise<RoomDB | null> {
  const currentUser = getStoredUser();
  if (!currentUser) {
    console.error("No authenticated user found");
    return null;
  }

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) {
    console.error("No Supabase auth user found");
    return null;
  }

  const initials = calculateInitials(currentUser.name);

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name: input.name.trim(),
      description: (input.description || "").trim(),
      category: input.category || "Pitch",
      max_people: input.maxPeople || 20,
      is_private: input.isPrivate || false,
      password: input.isPrivate ? (input.password || null) : null,
      host_id: userId,
      host_name: currentUser.name,
      host_initials: initials,
      is_live: true,
      initial_topic: (input.initialTopic || "").trim(),
      people_count: 1,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating room:", error);
    return null;
  }

  // Auto-join as host participant
  await supabase.from("room_participants").upsert({
    room_id: (data as RoomDB).id,
    user_id: userId,
    user_name: currentUser.name,
    user_initials: initials,
    role: "Host",
  });

  return data as RoomDB;
}

/** Delete a room (only host can delete) */
export async function deleteRoom(roomId: string): Promise<boolean> {
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) {
    console.error("Error deleting room:", error);
    return false;
  }
  return true;
}

/** Fetch messages for a room */
export async function fetchRoomMessages(roomId: string): Promise<RoomMessageDB[]> {
  const { data, error } = await supabase
    .from("room_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return (data as RoomMessageDB[]) || [];
}

/** Send a message to a room */
export async function sendRoomMessage(
  roomId: string,
  text: string
): Promise<RoomMessageDB | null> {
  const currentUser = getStoredUser();
  if (!currentUser) return null;

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return null;

  const initials = calculateInitials(currentUser.name);

  const { data, error } = await supabase
    .from("room_messages")
    .insert({
      room_id: roomId,
      sender_id: userId,
      sender_name: currentUser.name,
      sender_initials: initials,
      text: text.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }
  return data as RoomMessageDB;
}

/** Join a room as participant */
export async function joinRoomParticipant(roomId: string, role = "Ouvinte"): Promise<void> {
  const currentUser = getStoredUser();
  if (!currentUser) return;

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return;

  const initials = calculateInitials(currentUser.name);

  await supabase.from("room_participants").upsert({
    room_id: roomId,
    user_id: userId,
    user_name: currentUser.name,
    user_initials: initials,
    role,
    last_seen: new Date().toISOString(),
  });

  // Update people_count
  const { data: participants } = await supabase
    .from("room_participants")
    .select("id")
    .eq("room_id", roomId);

  if (participants) {
    await supabase
      .from("rooms")
      .update({ people_count: participants.length })
      .eq("id", roomId);
  }
}

/** Leave a room (remove participant) */
export async function leaveRoomParticipant(roomId: string): Promise<void> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return;

  await removeParticipant(roomId, userId);
}

/** Remove a participant by ID (useful for host) */
export async function removeParticipant(roomId: string, targetUserId: string): Promise<boolean> {
  const { error } = await supabase
    .from("room_participants")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", targetUserId);

  if (error) {
    console.error("Error removing participant:", error);
    return false;
  }

  // Update people_count
  const { data: participants } = await supabase
    .from("room_participants")
    .select("id")
    .eq("room_id", roomId);

  if (participants !== null) {
    await supabase
      .from("rooms")
      .update({ people_count: participants.length })
      .eq("id", roomId);
  }
  
  return true;
}

/** Add a specific user as participant (useful for host) */
export async function addParticipant(
  roomId: string, 
  user: { id: string; name: string; initials: string },
  role = "Ouvinte"
): Promise<boolean> {
  const { error } = await supabase.from("room_participants").upsert({
    room_id: roomId,
    user_id: user.id,
    user_name: user.name,
    user_initials: user.initials,
    role,
    last_seen: new Date().toISOString(),
  });

  if (error) {
    console.error("Error adding participant:", error);
    return false;
  }

  // Update people_count
  const { data: participants } = await supabase
    .from("room_participants")
    .select("id")
    .eq("room_id", roomId);

  if (participants !== null) {
    await supabase
      .from("rooms")
      .update({ people_count: participants.length })
      .eq("id", roomId);
  }
  
  return true;
}

/** Fetch participants for a room */
export async function fetchRoomParticipants(roomId: string): Promise<RoomParticipantDB[]> {
  const { data, error } = await supabase
    .from("room_participants")
    .select("*")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
  return (data as RoomParticipantDB[]) || [];
}

/** Subscribe to new messages in a room using Supabase Realtime */
export function subscribeToRoomMessages(
  roomId: string,
  onNewMessage: (msg: RoomMessageDB) => void
) {
  const channel = supabase
    .channel(`room_messages:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "room_messages",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onNewMessage(payload.new as RoomMessageDB);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to participants changes in a room */
export function subscribeToRoomParticipants(
  roomId: string,
  onChange: (participants: RoomParticipantDB[]) => void
) {
  const channel = supabase
    .channel(`room_participants:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_participants",
        filter: `room_id=eq.${roomId}`,
      },
      async () => {
        const participants = await fetchRoomParticipants(roomId);
        onChange(participants);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to rooms list changes */
export function subscribeToRooms(onChange: () => void) {
  const channel = supabase
    .channel("rooms_list")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "rooms" },
      () => onChange()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Subscribe to specific room deletion */
export function subscribeToRoomDeletion(
  roomId: string,
  onDeleted: () => void
) {
  const channel = supabase
    .channel(`room_delete:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      () => onDeleted()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

