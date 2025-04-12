
import { supabase } from "@/integrations/supabase/client";
import { Debate, Comment } from "@/types/forum";

// Forum-related API service
export const forumService = {
  // Fetch debates with optional category filter
  fetchDebates: async (selectedCategory: string | null) => {
    let query = supabase
      .from("debates_with_authors")
      .select("*");

    if (selectedCategory) {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching debates:", error);
      throw error;
    }

    console.log("Fetched debates:", data);
    return data as Debate[];
  },

  // Create a new debate
  createDebate: async (title: string, content: string, category: string, userId: string) => {
    console.log("Creating debate:", { title, content, category, userId });
    
    // First check if the user has the correct level in profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("level_numeric")
      .eq("id", userId)
      .single();
    
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      throw new Error("No se pudo verificar tu nivel de usuario");
    }
    
    const userLevel = profileData?.level_numeric || 1;
    console.log("User level:", userLevel);
    
    // Allow any user with level 3 or higher, or admin users (level 13) to create debates
    // The condition was modified to be more permissive
    if (userLevel < 3 && userLevel !== 13) {
      console.error("User level too low:", userLevel);
      throw new Error("Tu nivel de usuario no es suficiente para crear debates. Necesitas ser nivel 3 o superior.");
    }
    
    // Use a direct insert instead of RPC for now
    const { data, error } = await supabase
      .from("debates")
      .insert([{ 
        title, 
        content, 
        category, 
        author_id: userId 
      }])
      .select();

    if (error) {
      console.error("Error creating debate:", error);
      throw error;
    }

    console.log("Debate created successfully:", data);
    return data[0];
  },

  // Fetch a newly created debate with author info
  fetchNewDebate: async (debateId: string) => {
    const { data, error } = await supabase
      .from("debates_with_authors")
      .select("*")
      .eq("id", debateId)
      .single();

    if (error) {
      console.error("Error fetching new debate:", error);
      throw error;
    }

    return data as Debate;
  },

  // Register a vote on a debate
  registerVote: async (debateId: string, voteType: "up" | "down", userId: string) => {
    const { error } = await supabase
      .from("votes")
      .insert([
        { 
          user_id: userId, 
          reference_id: debateId, 
          reference_type: "debate", 
          vote_type: voteType 
        }
      ]);

    if (error) {
      // Handle unique constraint violation
      if (error.code === "23505") {
        throw new Error("duplicate_vote");
      }
      throw error;
    }
  },

  // Delete a debate
  deleteDebate: async (debateId: string) => {
    const { error } = await supabase
      .from("debates")
      .delete()
      .eq("id", debateId);

    if (error) {
      console.error("Error deleting debate:", error);
      throw error;
    }
  }
};
