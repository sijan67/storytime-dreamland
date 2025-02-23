
export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
      }
      voice_samples: {
        Row: {
          voice_id: string
          voice_name: string
          description: string | null
          sample_path: string
          created_at: string
        }
        Insert: {
          voice_id: string
          voice_name: string
          description?: string | null
          sample_path: string
          created_at?: string
        }
        Update: {
          voice_id?: string
          voice_name?: string
          description?: string | null
          sample_path?: string
          created_at?: string
        }
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
