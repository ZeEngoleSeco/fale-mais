export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: string | null
          bio: string | null
          avatar_color: string | null
          avatar_url: string | null
          level: number | null
          xp: number | null
          xp_next_level: number | null
          streak_days: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: string | null
          bio?: string | null
          avatar_color?: string | null
          avatar_url?: string | null
          level?: number | null
          xp?: number | null
          xp_next_level?: number | null
          streak_days?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string | null
          bio?: string | null
          avatar_color?: string | null
          avatar_url?: string | null
          level?: number | null
          xp?: number | null
          xp_next_level?: number | null
          streak_days?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          id: string
          name: string
          desc: string | null
          category: string | null
          people_count: number | null
          max_people: number | null
          is_private: boolean | null
          is_live: boolean | null
          host_id: string | null
          host_name: string
          host_initials: string
          host_role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          desc?: string | null
          category?: string | null
          people_count?: number | null
          max_people?: number | null
          is_private?: boolean | null
          is_live?: boolean | null
          host_id?: string | null
          host_name: string
          host_initials: string
          host_role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          desc?: string | null
          category?: string | null
          people_count?: number | null
          max_people?: number | null
          is_private?: boolean | null
          is_live?: boolean | null
          host_id?: string | null
          host_name?: string
          host_initials?: string
          host_role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          name: string
          initials: string
          role: string | null
          is_online: boolean | null
          has_hand_raised: boolean | null
          is_muted: boolean | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          name: string
          initials: string
          role?: string | null
          is_online?: boolean | null
          has_hand_raised?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          name?: string
          initials?: string
          role?: string | null
          is_online?: boolean | null
          has_hand_raised?: boolean | null
          is_muted?: boolean | null
          joined_at?: string | null
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          sender_name: string
          text: string
          created_at: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          sender_name: string
          text: string
          created_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          sender_name?: string
          text?: string
          created_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          desc: string
          place: string
          date: string
          full_date: string | null
          time: string
          confirmed_count: number | null
          max_capacity: number | null
          kind: string | null
          category: string | null
          is_featured: boolean | null
          organizer_name: string | null
          organizer_initials: string | null
          organizer_events_held: number | null
          speakers: Json | null
          agenda: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          desc: string
          place: string
          date: string
          full_date?: string | null
          time: string
          confirmed_count?: number | null
          max_capacity?: number | null
          kind?: string | null
          category?: string | null
          is_featured?: boolean | null
          organizer_name?: string | null
          organizer_initials?: string | null
          organizer_events_held?: number | null
          speakers?: Json | null
          agenda?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          desc?: string
          place?: string
          date?: string
          full_date?: string | null
          time?: string
          confirmed_count?: number | null
          max_capacity?: number | null
          kind?: string | null
          category?: string | null
          is_featured?: boolean | null
          organizer_name?: string | null
          organizer_initials?: string | null
          organizer_events_held?: number | null
          speakers?: Json | null
          agenda?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          user_email: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          user_email?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          user_email?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      ai_sessions: {
        Row: {
          id: string
          user_id: string | null
          mode: string | null
          title: string | null
          score: number | null
          feedback_summary: string | null
          strengths: Json | null
          improvements: Json | null
          duration: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          mode?: string | null
          title?: string | null
          score?: number | null
          feedback_summary?: string | null
          strengths?: Json | null
          improvements?: Json | null
          duration?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          mode?: string | null
          title?: string | null
          score?: number | null
          feedback_summary?: string | null
          strengths?: Json | null
          improvements?: Json | null
          duration?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string | null
          sender: string
          text: string
          tips: Json | null
          metrics: Json | null
          report_card: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          user_id?: string | null
          sender: string
          text: string
          tips?: Json | null
          metrics?: Json | null
          report_card?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string | null
          sender?: string
          text?: string
          tips?: Json | null
          metrics?: Json | null
          report_card?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string | null
          badge_id: string
          title: string
          description: string | null
          icon: string | null
          xp_reward: number | null
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          badge_id: string
          title: string
          description?: string | null
          icon?: string | null
          xp_reward?: number | null
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          badge_id?: string
          title?: string
          description?: string | null
          icon?: string | null
          xp_reward?: number | null
          unlocked_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
