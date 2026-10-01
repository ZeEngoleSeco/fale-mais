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
          description: string | null
          category: string
          max_people: number
          is_private: boolean
          password: string | null
          host_id: string
          host_name: string
          host_initials: string
          is_live: boolean
          initial_topic: string | null
          people_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string
          max_people?: number
          is_private?: boolean
          password?: string | null
          host_id: string
          host_name: string
          host_initials: string
          is_live?: boolean
          initial_topic?: string | null
          people_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          max_people?: number
          is_private?: boolean
          password?: string | null
          host_id?: string
          host_name?: string
          host_initials?: string
          is_live?: boolean
          initial_topic?: string | null
          people_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          sender_name: string
          sender_initials: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          sender_name: string
          sender_initials: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string
          sender_name?: string
          sender_initials?: string
          text?: string
          created_at?: string
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          user_name: string
          user_initials: string
          role: string
          joined_at: string
          last_seen: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          user_name: string
          user_initials: string
          role?: string
          joined_at?: string
          last_seen?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          user_name?: string
          user_initials?: string
          role?: string
          joined_at?: string
          last_seen?: string
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
