
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export const useAdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { 
    data: users, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, level_numeric, experience")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        });
        throw error;
      }

      return data.map(profile => ({
        ...profile,
        experience: typeof profile.experience === 'number' ? profile.experience : 0,
        level: typeof profile.level_numeric === 'number' ? profile.level_numeric : 1
      })) as Profile[];
    },
  });

  const filteredUsers = users?.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize required XP actions in the database
  const initializeXpActions = async () => {
    try {
      const actions = [
        { 
          action_name: 'create_debate', 
          description: 'Crear un nuevo debate', 
          xp_value: 50, 
          repeatable: true,
          max_times: null
        },
        { 
          action_name: 'create_comment', 
          description: 'Comentar en un debate', 
          xp_value: 10, 
          repeatable: true,
          max_times: null
        },
        { 
          action_name: 'vote_forum', 
          description: 'Votar en un debate o comentario', 
          xp_value: 5, 
          repeatable: true,
          max_times: null
        },
        { 
          action_name: 'submit_feedback', 
          description: 'Enviar feedback (no anónimo)', 
          xp_value: 50, 
          repeatable: true,
          max_times: 10  // Maximum 500 XP from feedback (10 * 50)
        }
      ];
      
      await Promise.all(actions.map(async (action) => {
        const { data } = await supabase
          .from('xp_actions')
          .select('id')
          .eq('action_name', action.action_name)
          .limit(1);
          
        if (!data || data.length === 0) {
          await supabase.from('xp_actions').insert([action]);
        }
      }));
    } catch (error) {
      console.error("Error initializing XP actions:", error);
    }
  };
  
  // Initialize XP actions when the hook is first used
  useState(() => {
    initializeXpActions();
  });

  return {
    users: filteredUsers,
    isLoading,
    refetch,
    searchTerm,
    setSearchTerm
  };
};

export default useAdminUsers;
