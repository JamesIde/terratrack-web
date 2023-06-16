export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          description: string | null
          distance: number | null
          duration: number | null
          elevation: Json | null
          endTime: string | null
          id: string
          metadata: Json | null
          slug: string | null
          startTime: string | null
          type: string | null
          userId: string | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          distance?: number | null
          duration?: number | null
          elevation?: Json | null
          endTime?: string | null
          id: string
          metadata?: Json | null
          slug?: string | null
          startTime?: string | null
          type?: string | null
          userId?: string | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          distance?: number | null
          duration?: number | null
          elevation?: Json | null
          endTime?: string | null
          id?: string
          metadata?: Json | null
          slug?: string | null
          startTime?: string | null
          type?: string | null
          userId?: string | null
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
