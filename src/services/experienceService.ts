
import { supabase } from "@/integrations/supabase/client";

// Experience-related API service
export const experienceService = {
  // Add XP to a user
  addXp: async (userId: string, actionName: string, description: string) => {
    await supabase.rpc('add_user_xp', { 
      _user_id: userId,
      _action_name: actionName,
      _custom_description: description
    });
  },

  // Add XP for creating a debate
  addDebateXp: async (userId: string, debateTitle: string) => {
    return experienceService.addXp(
      userId,
      'create_forum',
      `Creación de debate: ${debateTitle}`
    );
  },

  // Add XP for voting
  addVoteXp: async (userId: string) => {
    return experienceService.addXp(
      userId,
      'vote_forum',
      'Voto en el foro'
    );
  }
};
