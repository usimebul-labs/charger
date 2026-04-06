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
            charger_infos: {
                Row: {
                    capacity: string | null
                    created_at: string | null
                    floor: string | null
                    id: number
                    search_key: number
                    status_code: string | null
                    type_code: string | null
                    updated_at: string | null
                }
                Insert: {
                    capacity?: string | null
                    created_at?: string | null
                    floor?: string | null
                    id: number
                    search_key: number
                    status_code?: string | null
                    type_code?: string | null
                    updated_at?: string | null
                }
                Update: {
                    capacity?: string | null
                    created_at?: string | null
                    floor?: string | null
                    id?: number
                    search_key?: number
                    status_code?: string | null
                    type_code?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "charger_infos_status_code_fkey"
                        columns: ["status_code"]
                        isOneToOne: false
                        referencedRelation: "charger_statuses"
                        referencedColumns: ["code"]
                    },
                    {
                        foreignKeyName: "charger_infos_type_code_fkey"
                        columns: ["type_code"]
                        isOneToOne: false
                        referencedRelation: "charger_types"
                        referencedColumns: ["code"]
                    },
                ]
            }
            charger_status_logs: {
                Row: {
                    changed_at: string | null
                    charger_id: number | null
                    id: number
                    new_status_code: string | null
                    old_status_code: string | null
                }
                Insert: {
                    changed_at?: string | null
                    charger_id?: number | null
                    id?: number
                    new_status_code?: string | null
                    old_status_code?: string | null
                }
                Update: {
                    changed_at?: string | null
                    charger_id?: number | null
                    id?: number
                    new_status_code?: string | null
                    old_status_code?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "charger_status_logs_charger_id_fkey"
                        columns: ["charger_id"]
                        isOneToOne: false
                        referencedRelation: "charger_infos"
                        referencedColumns: ["id"]
                    },
                ]
            }
            charger_statuses: {
                Row: {
                    code: string
                    value: string
                }
                Insert: {
                    code: string
                    value: string
                }
                Update: {
                    code?: string
                    value?: string
                }
                Relationships: []
            }
            charger_types: {
                Row: {
                    code: string
                    value: string
                }
                Insert: {
                    code: string
                    value: string
                }
                Update: {
                    code?: string
                    value?: string
                }
                Relationships: []
            }
            charger_watings: {
                Row: {
                    created_at: string | null
                    id: string
                    subscription: Json
                    type_code: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    subscription: Json
                    type_code?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    subscription?: Json
                    type_code?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "charger_watings_type_code_fkey"
                        columns: ["type_code"]
                        isOneToOne: false
                        referencedRelation: "charger_types"
                        referencedColumns: ["code"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            upsert_charger_info: {
                Args: {
                    p_capacity: string
                    p_floor: string
                    p_id: number
                    p_search_key: number
                    p_status_code: string
                    p_status_value: string
                    p_type_code: string
                    p_type_value: string
                }
                Returns: undefined
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
