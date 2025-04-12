
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Debate } from "@/types/forum";
import { useToast } from "@/hooks/use-toast";

// Separate service functions to make the hook cleaner
const forumService = {
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

export const useDebates = (selectedCategory: string | null) => {
  const { toast } = useToast();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load debates
  useEffect(() => {
    const loadDebates = async () => {
      setIsLoading(true);
      try {
        const data = await forumService.fetchDebates(selectedCategory);
        console.log("Fetched debates:", data.length);
        setDebates(data);
        setError(null);
      } catch (err) {
        console.error("Error loading debates:", err);
        setError("No se pudieron cargar los debates. Intenta nuevamente más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDebates();
  }, [selectedCategory]);

  // Handle debate creation
  const handleCreateDebate = async (title: string, content: string, category: string, userId: string) => {
    try {
      // Validate inputs
      if (!title.trim() || !content.trim() || !category || !userId) {
        toast({
          title: "Datos incompletos",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return false;
      }

      // Create the debate
      const newDebate = await forumService.createDebate(title, content, category, userId);
      console.log("Debate created:", newDebate);

      // Fetch the complete debate with author info
      const completeDebate = await forumService.fetchNewDebate(newDebate.id);
      
      // Update local state
      setDebates([completeDebate, ...debates]);
      
      // Add experience points
      await forumService.addDebateXp(userId, title);

      toast({
        title: "Debate creado",
        description: "Tu debate ha sido publicado con éxito",
      });
      
      return true;
    } catch (err: any) {
      console.error("Error creating debate:", err);
      
      // Specific error handling for RLS violations
      if (err.message?.includes("violates row-level security policy")) {
        toast({
          title: "Error de permisos",
          description: "No tienes permisos para crear debates",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo crear el debate: " + (err.message || "Error desconocido"),
          variant: "destructive",
        });
      }
      
      // Refresh debates as a fallback to ensure UI is in sync with DB
      try {
        const refreshedData = await forumService.fetchDebates(selectedCategory);
        setDebates(refreshedData);
      } catch (refreshErr) {
        console.error("Error refreshing debates:", refreshErr);
      }
      
      return false;
    }
  };

  // Handle vote
  const handleVote = async (debateId: string, voteType: "up" | "down", userId: string) => {
    try {
      await forumService.registerVote(debateId, voteType, userId);

      // Optimistic update of UI
      setDebates(debates.map(debate => {
        if (debate.id === debateId) {
          if (voteType === "up") {
            return { ...debate, votes_up: debate.votes_up + 1 };
          } else {
            return { ...debate, votes_down: debate.votes_down + 1 };
          }
        }
        return debate;
      }));

      // Add experience points
      await forumService.addVoteXp(userId);

      toast({
        title: "Voto registrado",
        description: "Tu voto ha sido registrado con éxito",
      });
    } catch (err: any) {
      if (err.message === "duplicate_vote") {
        toast({
          title: "Voto duplicado",
          description: "Ya has votado en este debate",
          variant: "destructive",
        });
      } else {
        console.error("Error voting:", err);
        toast({
          title: "Error",
          description: "No se pudo registrar el voto",
          variant: "destructive",
        });
      }
    }
  };

  // Handle debate deletion
  const handleDeleteDebate = async (debateId: string) => {
    try {
      await forumService.deleteDebate(debateId);

      // Update local state
      setDebates(debates.filter(debate => debate.id !== debateId));
      
      toast({
        title: "Debate eliminado",
        description: "El debate ha sido eliminado con éxito",
      });
    } catch (err) {
      console.error("Error deleting debate:", err);
      toast({
        title: "Error",
        description: "No se pudo eliminar el debate",
        variant: "destructive",
      });
    }
  };

  return {
    debates,
    isLoading,
    error,
    handleCreateDebate,
    handleVote,
    handleDeleteDebate
  };
};
