export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asado_registrations: {
        Row: {
          additional_info: string | null
          bringing_guests: boolean
          created_at: string
          dietary_preference: string
          dietary_restrictions: string | null
          email: string
          full_name: string
          guest_names: string | null
          help_with_organization: boolean
          id: string
          number_of_guests: number | null
          other_dietary_preference: string | null
          personal_link: string | null
          phone: string
        }
        Insert: {
          additional_info?: string | null
          bringing_guests?: boolean
          created_at?: string
          dietary_preference: string
          dietary_restrictions?: string | null
          email: string
          full_name: string
          guest_names?: string | null
          help_with_organization?: boolean
          id?: string
          number_of_guests?: number | null
          other_dietary_preference?: string | null
          personal_link?: string | null
          phone: string
        }
        Update: {
          additional_info?: string | null
          bringing_guests?: boolean
          created_at?: string
          dietary_preference?: string
          dietary_restrictions?: string | null
          email?: string
          full_name?: string
          guest_names?: string | null
          help_with_organization?: boolean
          id?: string
          number_of_guests?: number | null
          other_dietary_preference?: string | null
          personal_link?: string | null
          phone?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          debate_id: string
          id: string
          votes_down: number
          votes_up: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          debate_id: string
          id?: string
          votes_down?: number
          votes_up?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          debate_id?: string
          id?: string
          votes_down?: number
          votes_up?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          author_id: string
          category: string
          content: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          download_url: string | null
          duration: string | null
          external_url: string | null
          id: string
          image_url: string | null
          price: string | null
          published: boolean
          resource_type: string | null
          resource_url: string | null
          source: string | null
          title: string
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          author_id: string
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          download_url?: string | null
          duration?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          price?: string | null
          published?: boolean
          resource_type?: string | null
          resource_url?: string | null
          source?: string | null
          title: string
          type: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          download_url?: string | null
          duration?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          price?: string | null
          published?: boolean
          resource_type?: string | null
          resource_url?: string | null
          source?: string | null
          title?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_author_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      debates: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          votes_down: number
          votes_up: number
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          votes_down?: number
          votes_up?: number
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          votes_down?: number
          votes_up?: number
        }
        Relationships: []
      }
      domains: {
        Row: {
          created_at: string
          description: string | null
          external_url: string | null
          id: string
          name: string
          owner: string | null
          path: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          name: string
          owner?: string | null
          path: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          name?: string
          owner?: string | null
          path?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          price: string | null
          reservation_link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: string | null
          reservation_link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          price?: string | null
          reservation_link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          user_id: string | null
          username: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          user_id?: string | null
          username?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      influencer_program_interests: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          status: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      levels: {
        Row: {
          description: string | null
          level_id: number
          min_xp: number
          name: string
        }
        Insert: {
          description?: string | null
          level_id: number
          min_xp: number
          name: string
        }
        Update: {
          description?: string | null
          level_id?: number
          min_xp?: number
          name?: string
        }
        Relationships: []
      }
      otros_idiomas: {
        Row: {
          created_at: string
          id: string
          idioma: string
        }
        Insert: {
          created_at?: string
          id?: string
          idioma: string
        }
        Update: {
          created_at?: string
          id?: string
          idioma?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          categories: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          email_visible: boolean | null
          experience: number | null
          gender: string | null
          id: string
          learning_languages: string[] | null
          level: string | null
          level_numeric: number | null
          preferred_language: string | null
          speaks_languages: string[] | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          categories?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          email_visible?: boolean | null
          experience?: number | null
          gender?: string | null
          id: string
          learning_languages?: string[] | null
          level?: string | null
          level_numeric?: number | null
          preferred_language?: string | null
          speaks_languages?: string[] | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          categories?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          email_visible?: boolean | null
          experience?: number | null
          gender?: string | null
          id?: string
          learning_languages?: string[] | null
          level?: string | null
          level_numeric?: number | null
          preferred_language?: string | null
          speaks_languages?: string[] | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          approved: boolean | null
          categories: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          long_description: string | null
          name: string
          profile_id: string
          tags: string[] | null
          updated_at: string | null
          url: string | null
          website_url: string | null
        }
        Insert: {
          approved?: boolean | null
          categories?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          long_description?: string | null
          name: string
          profile_id: string
          tags?: string[] | null
          updated_at?: string | null
          url?: string | null
          website_url?: string | null
        }
        Update: {
          approved?: boolean | null
          categories?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          long_description?: string | null
          name?: string
          profile_id?: string
          tags?: string[] | null
          updated_at?: string | null
          url?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          profile_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp_history: {
        Row: {
          action_id: string | null
          created_at: string | null
          custom_action: string | null
          description: string | null
          id: string
          user_id: string
          xp_amount: number
        }
        Insert: {
          action_id?: string | null
          created_at?: string | null
          custom_action?: string | null
          description?: string | null
          id?: string
          user_id: string
          xp_amount: number
        }
        Update: {
          action_id?: string | null
          created_at?: string | null
          custom_action?: string | null
          description?: string | null
          id?: string
          user_id?: string
          xp_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "xp_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          id: string
          reference_id: string
          reference_type: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reference_id: string
          reference_type: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reference_id?: string
          reference_type?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: []
      }
      xp_actions: {
        Row: {
          action_name: string
          created_at: string | null
          description: string
          id: string
          max_times: number | null
          repeatable: boolean | null
          xp_value: number
        }
        Insert: {
          action_name: string
          created_at?: string | null
          description: string
          id?: string
          max_times?: number | null
          repeatable?: boolean | null
          xp_value: number
        }
        Update: {
          action_name?: string
          created_at?: string | null
          description?: string
          id?: string
          max_times?: number | null
          repeatable?: boolean | null
          xp_value?: number
        }
        Relationships: []
      }
    }
    Views: {
      admin_domains_view: {
        Row: {
          created_at: string | null
          description: string | null
          external_url: string | null
          id: string | null
          name: string | null
          owner: string | null
          path: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          id?: string | null
          name?: string | null
          owner?: string | null
          path?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          id?: string | null
          name?: string | null
          owner?: string | null
          path?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments_with_authors: {
        Row: {
          author_avatar: string | null
          author_category: string | null
          author_id: string | null
          author_role: string | null
          author_username: string | null
          content: string | null
          created_at: string | null
          debate_id: string | null
          id: string | null
          votes_down: number | null
          votes_up: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates_with_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      debates_with_authors: {
        Row: {
          author_avatar: string | null
          author_category: string | null
          author_id: string | null
          author_role: string | null
          author_username: string | null
          category: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          title: string | null
          updated_at: string | null
          votes_down: number | null
          votes_up: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_xp: {
        Args: {
          _user_id: string
          _action_name: string
          _custom_description?: string
        }
        Returns: number
      }
      create_debate: {
        Args: {
          _title: string
          _content: string
          _category: string
          _author_id: string
        }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
