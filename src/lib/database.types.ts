export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wellness_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          age: number | null
          goals: Json
          current_challenges: string | null
          preferred_activity_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          age?: number | null
          goals?: Json
          current_challenges?: string | null
          preferred_activity_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          age?: number | null
          goals?: Json
          current_challenges?: string | null
          preferred_activity_time?: string
          created_at?: string
          updated_at?: string
        }
      }
      daily_routines: {
        Row: {
          id: string
          user_id: string
          date: string
          activities: Json
          completion_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          activities?: Json
          completion_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          activities?: Json
          completion_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      activity_completions: {
        Row: {
          id: string
          user_id: string
          routine_id: string | null
          activity_id: string
          activity_title: string
          activity_category: string
          completed_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          routine_id?: string | null
          activity_id: string
          activity_title: string
          activity_category: string
          completed_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          routine_id?: string | null
          activity_id?: string
          activity_title?: string
          activity_category?: string
          completed_at?: string
          notes?: string | null
        }
      }
      daily_checkins: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: number | null
          energy: number | null
          sleep_quality: number | null
          sleep_hours: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood?: number | null
          energy?: number | null
          sleep_quality?: number | null
          sleep_hours?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: number | null
          energy?: number | null
          sleep_quality?: number | null
          sleep_hours?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      manual_activities: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          duration_minutes: number | null
          notes: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          duration_minutes?: number | null
          notes?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          duration_minutes?: number | null
          notes?: string | null
          completed_at?: string
        }
      }
      wellness_tips: {
        Row: {
          id: string
          category: string
          title: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          title: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}
