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

/** Fetch all rooms from Supabase — never returns password_hash */
export async function fetchAllRooms(): Promise<RoomDB[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id,name,description,category,max_people,is_private,host_id,host_name,host_initials,is_live,initial_topic,people_count,created_at,updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
  return (data as RoomDB[]) || [];
}

/** Fetch a single room by id — never returns password_hash */
export async function fetchRoomById(id: string): Promise<RoomDB | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id,name,description,category,max_people,is_private,host_id,host_name,host_initials,is_live,initial_topic,people_count,created_at,updated_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    return null;
  }
  return data as RoomDB;
}

/**
 * Verify a room password securely.
 * The hash comparison happens entirely inside PostgreSQL via a
 * SECURITY DEFINER RPC — the hash never travels to the client.
 *
 * Returns:
 *   'ok'            — password correct
 *   'wrong_password'— incorrect password
 *   'not_private'   — room has no password (let user in)
 *   'not_found'     — room does not exist
 *   'error'         — unexpected server error
 */
export async function verifyRoomPassword(
  roomId: string,
  password: string
): Promise<"ok" | "wrong_password" | "not_private" | "not_found" | "error"> {
  try {
    const { data, error } = await supabase.rpc("verify_room_password", {
      p_room_id: roomId,
      p_password: password,
    });
    if (error) {
      console.error("verify_room_password error:", error);
      return "error";
    }
    return data as "ok" | "wrong_password" | "not_private" | "not_found";
  } catch {
    return "error";
  }
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

  // Build insert payload — never send plain-text password to a regular column.
  // We use a DB function to hash it, or pass null if not private.
  const insertPayload: Record<string, unknown> = {
    name: input.name.trim(),
    description: (input.description || "").trim(),
    category: input.category || "Pitch",
    max_people: input.maxPeople || 20,
    is_private: input.isPrivate || false,
    host_id: userId,
    host_name: currentUser.name,
    host_initials: initials,
    is_live: true,
    initial_topic: (input.initialTopic || "").trim(),
    people_count: 1,
  };

  // If private and a password was supplied, hash it server-side by calling
  // a helper RPC that inserts the row with crypt(). This keeps the plain-text
  // password from ever being stored unprotected.
  if (input.isPrivate && input.password) {
    const { data, error } = await supabase.rpc("create_room_with_password", {
      p_name:          insertPayload.name,
      p_description:   insertPayload.description,
      p_category:      insertPayload.category,
      p_max_people:    insertPayload.max_people,
      p_host_id:       insertPayload.host_id,
      p_host_name:     insertPayload.host_name,
      p_host_initials: insertPayload.host_initials,
      p_initial_topic: insertPayload.initial_topic,
      p_password:      input.password,
    });
    if (error || !data) {
      console.error("Error creating private room:", error);
      return null;
    }
    // RPC returns the new room row
    const room = data as RoomDB;
    await supabase.from("room_participants").upsert({
      room_id: room.id,
      user_id: userId,
      user_name: currentUser.name,
      user_initials: initials,
      role: "Host",
    });
    return room;
  }

  // Public room — standard insert
  const { data, error } = await supabase
    .from("rooms")
    .insert(insertPayload)
    .select(
      "id,name,description,category,max_people,is_private,host_id,host_name,host_initials,is_live,initial_topic,people_count,created_at,updated_at"
    )
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

/** Check if user was removed from room by host */
export async function isUserRemovedFromRoom(roomId: string, userId: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      if (localStorage.getItem(`fale_mais_kicked_${roomId}_${userId}`) === "true") {
        return true;
      }
    } catch {}
  }

  try {
    const { data, error } = await supabase
      .from("room_removals")
      .select("id")
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

/** Fetch registered profiles from Supabase for inviting/adding to room */
export async function fetchAvailableProfiles(): Promise<{
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor?: string;
  avatarUrl?: string;
}[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, avatar_color, avatar_url")
      .order("name", { ascending: true })
      .limit(100);

    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      name: p.name || "Usuário",
      email: p.email || "",
      initials: calculateInitials(p.name || "U"),
      avatarColor: p.avatar_color,
      avatarUrl: p.avatar_url,
    }));
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return [];
  }
}

/** Join a room as participant */
export async function joinRoomParticipant(
  roomId: string,
  role = "Ouvinte"
): Promise<{ success: boolean; removed?: boolean }> {
  const currentUser = getStoredUser();
  if (!currentUser) return { success: false };

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return { success: false };

  // Check if user was removed previously
  const removed = await isUserRemovedFromRoom(roomId, userId);
  if (removed) {
    return { success: false, removed: true };
  }

  const initials = calculateInitials(currentUser.name);

  const { error } = await supabase.from("room_participants").upsert(
    {
      room_id: roomId,
      user_id: userId,
      user_name: currentUser.name,
      user_initials: initials,
      role,
      last_seen: new Date().toISOString(),
    },
    { onConflict: "room_id,user_id" }
  );

  if (error) {
    console.error("Error joining participant:", error);
    return { success: false };
  }

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

  return { success: true };
}

/** Leave a room (remove participant voluntarily) */
export async function leaveRoomParticipant(roomId: string): Promise<void> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;
  if (!userId) return;

  await supabase
    .from("room_participants")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", userId);

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
}

/** Remove a participant by ID (host action) */
export async function removeParticipant(
  roomId: string,
  targetUserId: string,
  participantRowId?: string
): Promise<boolean> {
  const { data: authData } = await supabase.auth.getUser();
  const currentAuthId = authData?.user?.id;

  // 1. Record removal in room_removals — this is what triggers the Realtime
  //    INSERT event on the kicked user's client, showing the "removed" message.
  if (currentAuthId && currentAuthId !== targetUserId) {
    try {
      await supabase.from("room_removals").upsert(
        {
          room_id: roomId,
          user_id: targetUserId,
          removed_by: currentAuthId,
          reason: "Removido pelo anfitrião",
        },
        { onConflict: "room_id,user_id" }
      );
    } catch (e) {
      console.warn("Could not record removal in room_removals:", e);
    }
  }

  // 2. Delete the participant row — this triggers the Realtime DELETE event
  //    on all other clients, silently updating their participant lists.
  if (participantRowId) {
    try {
      await supabase
        .from("room_participants")
        .delete()
        .eq("id", participantRowId);
    } catch (e) {
      console.warn("Error deleting by row id:", e);
    }
  }

  try {
    await supabase
      .from("room_participants")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", targetUserId);
  } catch (err) {
    console.error("Error removing participant:", err);
  }

  // 3. Update people_count
  const { data: remaining } = await supabase
    .from("room_participants")
    .select("id")
    .eq("room_id", roomId);

  if (remaining !== null) {
    await supabase
      .from("rooms")
      .update({ people_count: remaining.length })
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
  // Clear any previous removal so the user can rejoin
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(`fale_mais_kicked_${roomId}_${user.id}`);
    } catch {}
  }

  try {
    await supabase
      .from("room_removals")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", user.id);
  } catch (e) {
    console.warn("Could not clear previous removal:", e);
  }

  // Insert participant — the Realtime INSERT event will update all clients
  const { error } = await supabase.from("room_participants").upsert(
    {
      room_id: roomId,
      user_id: user.id,
      user_name: user.name,
      user_initials: user.initials,
      role,
      last_seen: new Date().toISOString(),
    },
    { onConflict: "room_id,user_id" }
  );

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

/**
 * Subscribe to participant changes in a room using Supabase Realtime.
 *
 * Best-practice implementation:
 * - Each call creates a channel with a **unique name** (timestamp suffix) so
 *   multiple components can subscribe simultaneously without conflicting.
 * - Kick detection uses TWO DB event paths:
 *   a) INSERT on `room_removals` → fires immediately when host removes someone
 *      → only the kicked user sees the "removed" message (ID comparison on client)
 *   b) DELETE on `room_participants` → fires for everyone → silently refreshes list
 * - No fragile WebSocket broadcast needed for kick notification.
 */
export function subscribeToRoomParticipants(
  roomId: string,
  onChange: (participants: RoomParticipantDB[]) => void,
  onUserRemoved?: (removedUserId: string) => void
) {
  // Unique channel name prevents "already subscribed" conflicts between pages
  const channelName = `room_participants:${roomId}:${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    // ── Path A: host added someone to room_removals ────────────────────────
    // Fires for ALL clients in the room, but we only act on it for the kicked user.
    // The component compares removedUserId with the current logged-in user's ID.
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "room_removals",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload: any) => {
        const removedUserId: string | undefined = payload.new?.user_id;
        if (removedUserId) {
          // Signal the component — it will compare with currentUserId
          onUserRemoved?.(removedUserId);
        }
        // Refresh the participant list for everyone
        const participants = await fetchRoomParticipants(roomId);
        onChange(participants);
      }
    )
    // ── Path B: any row in room_participants was inserted or deleted ────────
    // Covers voluntary leaves, joins, and confirms kicks.
    // For DELETE events, payload.old.user_id is available because we set
    // REPLICA IDENTITY FULL on the table (done in migration).
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "room_participants",
        filter: `room_id=eq.${roomId}`,
      },
      async () => {
        const participants = await fetchRoomParticipants(roomId);
        onChange(participants);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "room_participants",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload: any) => {
        const removedUserId: string | undefined = payload.old?.user_id;
        if (removedUserId) {
          // Also fire onUserRemoved here as a safety net in case the
          // room_removals INSERT event was missed (e.g. voluntary leave)
          onUserRemoved?.(removedUserId);
        }
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
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "room_participants" },
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

