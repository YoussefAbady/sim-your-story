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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          badge_id: string
          category: string
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          points_required: number
        }
        Insert: {
          badge_id: string
          category: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          points_required: number
        }
        Update: {
          badge_id?: string
          category?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          points_required?: number
        }
        Relationships: []
      }
      points_history: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          points_earned: number
          user_identifier: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          points_earned: number
          user_identifier: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          points_earned?: number
          user_identifier?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          answers: Json | null
          completed_at: string
          created_at: string
          id: string
          quiz_data: Json | null
          quiz_type: string
          score: number | null
          total_questions: number | null
          user_email: string
          user_name: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string
          created_at?: string
          id?: string
          quiz_data?: Json | null
          quiz_type: string
          score?: number | null
          total_questions?: number | null
          user_email: string
          user_name: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string
          created_at?: string
          id?: string
          quiz_data?: Json | null
          quiz_type?: string
          score?: number | null
          total_questions?: number | null
          user_email?: string
          user_name?: string
        }
        Relationships: []
      }
      session_points_summary: {
        Row: {
          actions_performed: number
          created_at: string
          duration_seconds: number | null
          id: string
          milestone_reached: string | null
          session_id: string
          total_points: number
          unique_interactions: Json | null
          user_identifier: string
        }
        Insert: {
          actions_performed?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          milestone_reached?: string | null
          session_id: string
          total_points?: number
          unique_interactions?: Json | null
          user_identifier: string
        }
        Update: {
          actions_performed?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          milestone_reached?: string | null
          session_id?: string
          total_points?: number
          unique_interactions?: Json | null
          user_identifier?: string
        }
        Relationships: []
      }
      session_time: {
        Row: {
          created_at: string
          duration_seconds: number | null
          end_time: string | null
          id: string
          page_path: string | null
          session_id: string
          start_time: string
          user_identifier: string | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          page_path?: string | null
          session_id: string
          start_time?: string
          user_identifier?: string | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          page_path?: string | null
          session_id?: string
          start_time?: string
          user_identifier?: string | null
        }
        Relationships: []
      }
      simulation_logs: {
        Row: {
          account_funds: number | null
          actual_pension: number
          age: number
          created_at: string
          date_of_use: string
          expected_pension: number | null
          id: string
          illness_included: boolean
          postal_code: string | null
          real_pension: number
          salary_amount: number
          sex: string
          sub_account_funds: number | null
          time_of_use: string
        }
        Insert: {
          account_funds?: number | null
          actual_pension: number
          age: number
          created_at?: string
          date_of_use?: string
          expected_pension?: number | null
          id?: string
          illness_included?: boolean
          postal_code?: string | null
          real_pension: number
          salary_amount: number
          sex: string
          sub_account_funds?: number | null
          time_of_use?: string
        }
        Update: {
          account_funds?: number | null
          actual_pension?: number
          age?: number
          created_at?: string
          date_of_use?: string
          expected_pension?: number | null
          id?: string
          illness_included?: boolean
          postal_code?: string | null
          real_pension?: number
          salary_amount?: number
          sex?: string
          sub_account_funds?: number | null
          time_of_use?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_identifier: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_identifier: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["badge_id"]
          },
        ]
      }
      user_points: {
        Row: {
          created_at: string | null
          current_level: number | null
          id: string
          total_points: number | null
          updated_at: string | null
          user_identifier: string
        }
        Insert: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          total_points?: number | null
          updated_at?: string | null
          user_identifier: string
        }
        Update: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          total_points?: number | null
          updated_at?: string | null
          user_identifier?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
