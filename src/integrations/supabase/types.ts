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
          id: string
          image_url: string | null
          published: boolean
          resource_url: string | null
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
          id?: string
          image_url?: string | null
          published?: boolean
          resource_url?: string | null
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
          id?: string
          image_url?: string | null
          published?: boolean
          resource_url?: string | null
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
          gender: string | null
          id: string
          learning_languages: string[] | null
          level: string | null
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
          gender?: string | null
          id: string
          learning_languages?: string[] | null
          level?: string | null
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
          gender?: string | null
          id?: string
          learning_languages?: string[] | null
          level?: string | null
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
    }
    Views: {
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
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
