
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Debate } from "@/types/forum";
import { useToast } from "@/hooks/use-toast";

export const useDebates = (selectedCategory: string | null) => {
  const { toast } = useToast();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load debates
  useEffect(() => {
    const fetchDebates = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("debates_with_authors")
          .select("*");

        if (selectedCategory) {
          query = query.eq("category", selectedCategory);
        }

        const { data, error: dbError } = await query.order("created_at", { ascending: false });

        if (dbError) {
          throw dbError;
        }

        setDebates(data as Debate[]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading debates:", err);
        setError("No se pudieron cargar los debates. Intenta nuevamente más tarde.");
        setIsLoading(false);
      }
    };

    fetchDebates();
  }, [selectedCategory]);

  // Handle debate creation
  const handleCreateDebate = async (title: string, content: string, category: string, userId: string) => {
    try {
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
        toast({
          title: "Error",
          description: "No se pudo crear el debate: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch the newly created debate with author info
      const { data: newDebateWithAuthor, error: fetchError } = await supabase
        .from("debates_with_authors")
        .select("*")
        .eq("id", data[0].id)
        .single();

      if (fetchError) {
        console.error("Error fetching new debate:", fetchError);
      } else {
        setDebates([newDebateWithAuthor as Debate, ...debates]);
      }

      toast({
        title: "Debate creado",
        description: "Tu debate ha sido publicado con éxito",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating debate:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el debate",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle vote
  const handleVote = async (debateId: string, voteType: "up" | "down", userId: string) => {
    try {
      // Insert vote into votes table
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
        // If the error is because of a unique constraint violation,
        // it means the user already voted
        if (error.code === "23505") {
          toast({
            title: "Voto duplicado",
            description: "Ya has votado en este debate",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "No se pudo registrar el voto: " + error.message,
            variant: "destructive",
          });
        }
        return;
      }

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

      toast({
        title: "Voto registrado",
        description: "Tu voto ha sido registrado con éxito",
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar el voto",
        variant: "destructive",
      });
    }
  };

  // Handle debate deletion
  const handleDeleteDebate = async (debateId: string) => {
    try {
      const { error } = await supabase
        .from("debates")
        .delete()
        .eq("id", debateId);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el debate: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setDebates(debates.filter(debate => debate.id !== debateId));
      toast({
        title: "Debate eliminado",
        description: "El debate ha sido eliminado con éxito",
      });
    } catch (error) {
      console.error("Error deleting debate:", error);
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
