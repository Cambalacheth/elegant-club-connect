
import { useState, useEffect } from "react";
import { Debate } from "@/types/forum";
import { useToast } from "@/hooks/use-toast";
import { forumService } from "@/services/forumService";
import { experienceService } from "@/services/experienceService";

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
      
      if (!newDebate || !newDebate.id) {
        throw new Error("No se pudo crear el debate. Respuesta inválida del servidor.");
      }

      // Fetch the complete debate with author info to ensure we have all the necessary data
      const completeDebate = await forumService.fetchNewDebate(newDebate.id);
      
      // Update local state by adding the new debate to the beginning of the array
      setDebates(prevDebates => [completeDebate, ...prevDebates]);
      
      // Add experience points
      await experienceService.addDebateXp(userId, title);

      toast({
        title: "Debate creado",
        description: "Tu debate ha sido publicado con éxito",
      });
      
      return true;
    } catch (err: any) {
      console.error("Error creating debate:", err);
      
      // More specific error handling messages
      toast({
        title: "Error",
        description: err.message || "No se pudo crear el debate",
        variant: "destructive",
      });
      
      // Refresh debates to ensure UI is in sync with DB
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
      await experienceService.addVoteXp(userId);

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
