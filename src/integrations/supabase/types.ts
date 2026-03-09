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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      food_scans: {
        Row: {
          ai_advice: string | null
          calories: number | null
          carbs: number | null
          created_at: string
          fat: number | null
          food_name: string | null
          id: string
          image_url: string | null
          protein: number | null
          user_id: string
        }
        Insert: {
          ai_advice?: string | null
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fat?: number | null
          food_name?: string | null
          id?: string
          image_url?: string | null
          protein?: number | null
          user_id: string
        }
        Update: {
          ai_advice?: string | null
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fat?: number | null
          food_name?: string | null
          id?: string
          image_url?: string | null
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      health_assessments: {
        Row: {
          activity_level: string | null
          age: number | null
          analysis: string | null
          bp_status: string | null
          created_at: string
          diabetes_status: string | null
          diet_type: string | null
          health_goal: string | null
          id: string
          sleep_hours: number | null
          stress_level: number | null
          suggestions: Json | null
          user_id: string
          water_intake: number | null
          wellness_score: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          analysis?: string | null
          bp_status?: string | null
          created_at?: string
          diabetes_status?: string | null
          diet_type?: string | null
          health_goal?: string | null
          id?: string
          sleep_hours?: number | null
          stress_level?: number | null
          suggestions?: Json | null
          user_id: string
          water_intake?: number | null
          wellness_score?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          analysis?: string | null
          bp_status?: string | null
          created_at?: string
          diabetes_status?: string | null
          diet_type?: string | null
          health_goal?: string | null
          id?: string
          sleep_hours?: number | null
          stress_level?: number | null
          suggestions?: Json | null
          user_id?: string
          water_intake?: number | null
          wellness_score?: number | null
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          allergies: string | null
          calorie_target: number | null
          created_at: string
          cuisine_preference: string | null
          diet_preference: string | null
          id: string
          plan: Json | null
          user_id: string
        }
        Insert: {
          allergies?: string | null
          calorie_target?: number | null
          created_at?: string
          cuisine_preference?: string | null
          diet_preference?: string | null
          id?: string
          plan?: Json | null
          user_id: string
        }
        Update: {
          allergies?: string | null
          calorie_target?: number | null
          created_at?: string
          cuisine_preference?: string | null
          diet_preference?: string | null
          id?: string
          plan?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          bp_status: string | null
          created_at: string
          diabetes_status: string | null
          diet_preference: string | null
          email: string | null
          fitness_level: string | null
          gender: string | null
          health_goal: string | null
          height: number | null
          id: string
          name: string | null
          sleep_hours: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
          water_intake: number | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          bp_status?: string | null
          created_at?: string
          diabetes_status?: string | null
          diet_preference?: string | null
          email?: string | null
          fitness_level?: string | null
          gender?: string | null
          health_goal?: string | null
          height?: number | null
          id?: string
          name?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
          water_intake?: number | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          bp_status?: string | null
          created_at?: string
          diabetes_status?: string | null
          diet_preference?: string | null
          email?: string | null
          fitness_level?: string | null
          gender?: string | null
          health_goal?: string | null
          height?: number | null
          id?: string
          name?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
          water_intake?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      progress_records: {
        Row: {
          calories_consumed: number | null
          created_at: string
          date: string
          id: string
          notes: string | null
          sleep_hours: number | null
          user_id: string
          water_ml: number | null
          weight: number | null
          workouts_completed: number | null
        }
        Insert: {
          calories_consumed?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          sleep_hours?: number | null
          user_id: string
          water_ml?: number | null
          weight?: number | null
          workouts_completed?: number | null
        }
        Update: {
          calories_consumed?: number | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          sleep_hours?: number | null
          user_id?: string
          water_ml?: number | null
          weight?: number | null
          workouts_completed?: number | null
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          daily_time: number | null
          fitness_goal: string | null
          fitness_level: string | null
          id: string
          plan: Json | null
          user_id: string
          workout_location: string | null
        }
        Insert: {
          created_at?: string
          daily_time?: number | null
          fitness_goal?: string | null
          fitness_level?: string | null
          id?: string
          plan?: Json | null
          user_id: string
          workout_location?: string | null
        }
        Update: {
          created_at?: string
          daily_time?: number | null
          fitness_goal?: string | null
          fitness_level?: string | null
          id?: string
          plan?: Json | null
          user_id?: string
          workout_location?: string | null
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
    Enums: {},
  },
} as const
