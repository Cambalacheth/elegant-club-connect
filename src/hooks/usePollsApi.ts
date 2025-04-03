
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  vote_count?: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  show_results: boolean;
  created_at: string;
  poll_options: PollOption[];
}

export interface CreatePollData {
  title: string;
  description?: string;
  options: string[];
  showResults?: boolean;
}

export interface VoteData {
  pollId: string;
  optionId: string;
  userId: string;
}

const API_URL = "https://hunlwxpizenlsqcghffy.supabase.co/functions/v1/polls-api";

export const usePollsApi = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Obtiene todas las encuestas disponibles
   */
  const getPolls = async (): Promise<Poll[]> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/polls`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener encuestas");
      }
      
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las encuestas",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene una encuesta específica por su ID
   */
  const getPoll = async (pollId: string): Promise<Poll | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/polls/${pollId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener la encuesta");
      }
      
      return await response.json();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar la encuesta",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una nueva encuesta
   */
  const createPoll = async (pollData: CreatePollData): Promise<Poll | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/polls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pollData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear encuesta");
      }
      
      const newPoll = await response.json();
      
      toast({
        title: "Éxito",
        description: "Encuesta creada correctamente"
      });
      
      return newPoll;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la encuesta",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registra un voto en una encuesta
   */
  const submitVote = async (voteData: VoteData): Promise<{ success: boolean, alreadyVoted?: boolean, results?: any[] }> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(voteData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Si ya votó, no es realmente un error, solo informamos al usuario
        if (response.status === 409 && result.alreadyVoted) {
          toast({
            title: "Voto duplicado",
            description: "Ya has votado en esta encuesta"
          });
          return { success: false, alreadyVoted: true };
        }
        
        throw new Error(result.error || "Error al registrar el voto");
      }
      
      toast({
        title: "Voto registrado",
        description: "Tu voto ha sido registrado correctamente"
      });
      
      return { success: true, results: result.results };
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar el voto",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getPolls,
    getPoll,
    createPoll,
    submitVote
  };
};
