/**
 * Tipos del esquema de Supabase. Archivo generado: no se edita a mano.
 *
 * Para regenerarlo tras un cambio en la base:
 *   npx supabase gen types typescript --project-id hokvyjamnbbaxqirfbww > lib/supabase/tipos.ts
 * (o pidiéndoselo al MCP de Supabase, que es de donde salió este).
 */

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
  public: {
    Tables: {
      combates: {
        Row: {
          billing: string | null
          cierra_en: string
          estelar: boolean
          ganador: string | null
          numero: string
          orden: number
          pct_a: number | null
          peleador_a: string
          peleador_b: string
          votos_a: number
          votos_b: number
        }
        Insert: {
          billing?: string | null
          cierra_en?: string
          estelar?: boolean
          ganador?: string | null
          numero: string
          orden: number
          pct_a?: number | null
          peleador_a: string
          peleador_b: string
          votos_a?: number
          votos_b?: number
        }
        Update: {
          billing?: string | null
          cierra_en?: string
          estelar?: boolean
          ganador?: string | null
          numero?: string
          orden?: number
          pct_a?: number | null
          peleador_a?: string
          peleador_b?: string
          votos_a?: number
          votos_b?: number
        }
        Relationships: [
          {
            foreignKeyName: "combates_peleador_a_fkey"
            columns: ["peleador_a"]
            isOneToOne: false
            referencedRelation: "peleadores"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "combates_peleador_b_fkey"
            columns: ["peleador_b"]
            isOneToOne: false
            referencedRelation: "peleadores"
            referencedColumns: ["slug"]
          },
        ]
      }
      peleadores: {
        Row: {
          creado_en: string
          nombre: string
          pais: string
          slug: string
        }
        Insert: {
          creado_en?: string
          nombre: string
          pais: string
          slug: string
        }
        Update: {
          creado_en?: string
          nombre?: string
          pais?: string
          slug?: string
        }
        Relationships: []
      }
      perfiles: {
        Row: {
          avatar_url: string | null
          creado_en: string
          id: string
          nombre: string | null
        }
        Insert: {
          avatar_url?: string | null
          creado_en?: string
          id: string
          nombre?: string | null
        }
        Update: {
          avatar_url?: string | null
          creado_en?: string
          id?: string
          nombre?: string | null
        }
        Relationships: []
      }
      votos: {
        Row: {
          actualizado_en: string
          combate_numero: string
          creado_en: string
          lado: string
          usuario_id: string
        }
        Insert: {
          actualizado_en?: string
          combate_numero: string
          creado_en?: string
          lado: string
          usuario_id: string
        }
        Update: {
          actualizado_en?: string
          combate_numero?: string
          creado_en?: string
          lado?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votos_combate_numero_fkey"
            columns: ["combate_numero"]
            isOneToOne: false
            referencedRelation: "combates"
            referencedColumns: ["numero"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      quitar_voto: {
        Args: { p_combate: string }
        Returns: {
          billing: string | null
          cierra_en: string
          estelar: boolean
          ganador: string | null
          numero: string
          orden: number
          pct_a: number | null
          peleador_a: string
          peleador_b: string
          votos_a: number
          votos_b: number
        }
        SetofOptions: {
          from: "*"
          to: "combates"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      votar: {
        Args: { p_combate: string; p_lado: string }
        Returns: {
          billing: string | null
          cierra_en: string
          estelar: boolean
          ganador: string | null
          numero: string
          orden: number
          pct_a: number | null
          peleador_a: string
          peleador_b: string
          votos_a: number
          votos_b: number
        }
        SetofOptions: {
          from: "*"
          to: "combates"
          isOneToOne: true
          isSetofReturn: false
        }
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
  public: {
    Enums: {},
  },
} as const
