
import { supabase } from "@/integrations/supabase/client";
import { Debate, Comment } from "@/types/forum";

// Service for debate detail operations
export const debateDetailService = {
  // Fetch a single debate with author info
  fetchDebate: async (debateId: string) => {
    const { data, error } = await supabase
      .from("debates_with_authors")
      .select("*")
      .eq("id", debateId)
      .single();

    if (error) throw error;
    return data as Debate;
  },
  
  // Fetch comments for a debate
  fetchComments: async (debateId: string) => {
    const { data, error } = await supabase
      .from("comments_with_authors")
      .select("*")
      .eq("debate_id", debateId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Comment[];
  },
  
  // Register a vote on a debate
  registerDebateVote: async (debateId: string, voteType: "up" | "down", userId: string) => {
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
      if (error.code === "23505") {
        throw new Error("duplicate_vote");
      }
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

    if (error) throw error;
  },
  
  // Delete a comment
  deleteComment: async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;
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

    if (error) throw error;
    return data[0];
  },
  
  // Fetch a newly created comment with author info
  fetchNewComment: async (commentId: string) => {
    const { data, error } = await supabase
      .from("comments_with_authors")
      .select("*")
      .eq("id", commentId)
      .single();

    if (error) throw error;
    return data as Comment;
  }
};
