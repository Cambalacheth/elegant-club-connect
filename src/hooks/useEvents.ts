
import { useState } from "react";
import { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true, nullsLast: true });

      if (error) throw error;
      
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (newEvent: Omit<Event, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert(newEvent)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Evento creado correctamente",
      });
      
      return data;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Evento actualizado correctamente",
      });
      
      return data;
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el evento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Evento eliminado correctamente",
      });
      
      setEvents(events.filter(event => event.id !== id));
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
