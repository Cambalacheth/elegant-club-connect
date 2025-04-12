
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
    
    // Insert the debate
    const { data, error } = await supabase
      .from("debates")
      .insert([
        { 
          title, 
          content, 
          category, 
          author_id: userId 
        }
      ])
      .select();

    if (error) {
      console.error("Error creating debate:", error);
      throw error;
    }

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
  },

  // Fetch comments for a debate
  fetchComments: async (debateId: string) => {
    const { data, error } = await supabase
      .from("comments_with_authors")
      .select("*")
      .eq("debate_id", debateId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }

    return data as Comment[];
  },

  // Create a new comment
  createComment: async (debateId: string, content: string, userId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .insert([
        { 
          debate_id: debateId, 
          content, 
          author_id: userId 
        }
      ])
      .select();

    if (error) {
      console.error("Error creating comment:", error);
      throw error;
    }

    return data[0];
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  // Register a vote on a comment
  registerCommentVote: async (commentId: string, voteType: "up" | "down", userId: string) => {
    const { error } = await supabase
      .from("votes")
      .insert([
        { 
          user_id: userId, 
          reference_id: commentId, 
          reference_type: "comment", 
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
  }
};
