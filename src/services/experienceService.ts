
import { supabase } from "@/integrations/supabase/client";

// Experience-related operations
export const experienceService = {
  // Add experience points for creating a debate
  addDebateXp: async (userId: string, title: string) => {
    const { error } = await supabase.rpc('add_user_xp', { 
      _user_id: userId,
      _action_name: 'create_debate',
      _custom_description: `Creación de debate: ${title}`
    });
    
    if (error) {
      console.error("Error adding XP:", error);
    }
  },

  // Add XP for voting
  addVoteXp: async (userId: string) => {
    const { error } = await supabase.rpc('add_user_xp', { 
      _user_id: userId,
      _action_name: 'vote_forum',
      _custom_description: `Voto en debate`
    });
    
    if (error) {
      console.error("Error adding XP:", error);
    }
  }
};
