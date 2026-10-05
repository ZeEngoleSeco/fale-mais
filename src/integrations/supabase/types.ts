export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_messages: {
        Row: {
          created_at: string | null
          id: string
          metrics: Json | null
          report_card: Json | null
          sender: string
          session_id: string | null
          text: string
          tips: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metrics?: Json | null
          report_card?: Json | null
          sender: string
          session_id?: string | null
          text: string
          tips?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metrics?: Json | null
          report_card?: Json | null
          sender?: string
          session_id?: string | null
          text?: string
          tips?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_sessions: {
        Row: {
          created_at: string | null
          duration: string | null
          feedback_summary: string | null
          id: string
          improvements: Json | null
          mode: string | null
          score: number | null
          strengths: Json | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: string | null
          feedback_summary?: string | null
          id?: string
          improvements?: Json | null
          mode?: string | null
          score?: number | null
          strengths?: Json | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: string | null
          feedback_summary?: string | null
          id?: string
          improvements?: Json | null
          mode?: string | null
          score?: number | null
          strengths?: Json | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          agenda: Json | null
          category: string | null
          confirmed_count: number | null
          created_at: string | null
          date: string
          desc: string
          full_date: string | null
          id: string
          is_featured: boolean | null
          kind: string | null
          max_capacity: number | null
          organizer_events_held: number | null
          organizer_initials: string | null
          organizer_name: string | null
          place: string
          speakers: Json | null
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          agenda?: Json | null
          category?: string | null
          confirmed_count?: number | null
          created_at?: string | null
          date: string
          desc: string
          full_date?: string | null
          id?: string
          is_featured?: boolean | null
          kind?: string | null
          max_capacity?: number | null
          organizer_events_held?: number | null
          organizer_initials?: string | null
          organizer_name?: string | null
          place: string
          speakers?: Json | null
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          agenda?: Json | null
          category?: string | null
          confirmed_count?: number | null
          created_at?: string | null
          date?: string
          desc?: string
          full_date?: string | null
          id?: string
          is_featured?: boolean | null
          kind?: string | null
          max_capacity?: number | null
          organizer_events_held?: number | null
          organizer_initials?: string | null
          organizer_name?: string | null
          place?: string
          speakers?: Json | null
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
          speaker_status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          role?: string | null
          speaker_status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          speaker_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          created_at: string
          id: string
          room_id: string
          sender_id: string
          sender_initials: string
          sender_name: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id: string
          sender_id: string
          sender_initials: string
          sender_name: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string
          sender_id?: string
          sender_initials?: string
          sender_name?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_public"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          id: string
          joined_at: string
          last_seen: string
          role: string
          room_id: string
          user_id: string
          user_initials: string
          user_name: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_seen?: string
          role?: string
          room_id: string
          user_id: string
          user_initials: string
          user_name: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_seen?: string
          role?: string
          room_id?: string
          user_id?: string
          user_initials?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_public"
            referencedColumns: ["id"]
          },
        ]
      }
      room_removals: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          removed_by: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          removed_by?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          removed_by?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_removals_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_removals_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms_public"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          category: string
          created_at: string
          desc: string | null
          description: string | null
          host_id: string | null
          host_initials: string
          host_name: string
          host_role: string | null
          id: string
          initial_topic: string | null
          is_live: boolean
          is_private: boolean
          max_people: number
          name: string
          password_hash: string | null
          people_count: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          desc?: string | null
          description?: string | null
          host_id?: string | null
          host_initials: string
          host_name: string
          host_role?: string | null
          id?: string
          initial_topic?: string | null
          is_live?: boolean
          is_private?: boolean
          max_people?: number
          name: string
          password_hash?: string | null
          people_count?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          desc?: string | null
          description?: string | null
          host_id?: string | null
          host_initials?: string
          host_name?: string
          host_role?: string | null
          id?: string
          initial_topic?: string | null
          is_live?: boolean
          is_private?: boolean
          max_people?: number
          name?: string
          password_hash?: string | null
          people_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      speaker_verifications: {
        Row: {
          additional_info: string | null
          created_at: string | null
          experience_desc: string
          expertise_area: string
          full_name: string
          id: string
          previous_events: string | null
          professional_exp: string | null
          social_links: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_info?: string | null
          created_at?: string | null
          experience_desc: string
          expertise_area: string
          full_name: string
          id?: string
          previous_events?: string | null
          professional_exp?: string | null
          social_links?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_info?: string | null
          created_at?: string | null
          experience_desc?: string
          expertise_area?: string
          full_name?: string
          id?: string
          previous_events?: string | null
          professional_exp?: string | null
          social_links?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speaker_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          badge_id: string
          description: string | null
          icon: string | null
          id: string
          title: string
          unlocked_at: string | null
          user_id: string | null
          xp_reward: number | null
        }
        Insert: {
          badge_id: string
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          unlocked_at?: string | null
          user_id?: string | null
          xp_reward?: number | null
        }
        Update: {
          badge_id?: string
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          unlocked_at?: string | null
          user_id?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      rooms_public: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          host_id: string | null
          host_initials: string | null
          host_name: string | null
          id: string | null
          initial_topic: string | null
          is_live: boolean | null
          is_private: boolean | null
          max_people: number | null
          name: string | null
          people_count: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          host_id?: string | null
          host_initials?: string | null
          host_name?: string | null
          id?: string | null
          initial_topic?: string | null
          is_live?: boolean | null
          is_private?: boolean | null
          max_people?: number | null
          name?: string | null
          people_count?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          host_id?: string | null
          host_initials?: string | null
          host_name?: string | null
          id?: string | null
          initial_topic?: string | null
          is_live?: boolean | null
          is_private?: boolean | null
          max_people?: number | null
          name?: string | null
          people_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_speaker: { Args: { p_user_id: string }; Returns: undefined }
      create_room_with_password: {
        Args: {
          p_category: string
          p_description: string
          p_host_id: string
          p_host_initials: string
          p_host_name: string
          p_initial_topic: string
          p_max_people: number
          p_name: string
          p_password: string
        }
        Returns: {
          category: string
          created_at: string
          description: string
          host_id: string
          host_initials: string
          host_name: string
          id: string
          initial_topic: string
          is_live: boolean
          is_private: boolean
          max_people: number
          name: string
          people_count: number
          updated_at: string
        }[]
      }
      dev_force_approve_self_as_speaker: { Args: never; Returns: undefined }
      kick_room_participant: {
        Args: { p_room_id: string; p_target_user_id: string }
        Returns: boolean
      }
      submit_speaker_verification: {
        Args: {
          p_additional_info: string
          p_experience_desc: string
          p_expertise_area: string
          p_full_name: string
          p_previous_events: string
          p_professional_exp: string
          p_social_links: string
        }
        Returns: {
          dev_email: string
        }[]
      }
      verify_room_password: {
        Args: { p_password: string; p_room_id: string }
        Returns: string
      }
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
