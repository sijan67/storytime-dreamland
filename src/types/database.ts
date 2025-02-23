
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
          is_public: boolean
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          user_id: string
          is_public?: boolean
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          user_id?: string
          is_public?: boolean
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

export type Story = Database['public']['Tables']['stories']['Row']
export type VoiceSample = Database['public']['Tables']['voice_samples']['Row']
