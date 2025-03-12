
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
        .order("event_date", { ascending: true });
        
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
      // Prepare the event data by removing empty strings for nullable fields
      const eventData = {
        ...newEvent,
        event_date: newEvent.event_date && newEvent.event_date.trim() !== "" ? newEvent.event_date : null,
        price: newEvent.price && newEvent.price.trim() !== "" ? newEvent.price : null,
        location: newEvent.location && newEvent.location.trim() !== "" ? newEvent.location : null,
        reservation_link: newEvent.reservation_link && newEvent.reservation_link.trim() !== "" ? newEvent.reservation_link : null
      };
      
      const { data, error } = await supabase
        .from("events")
        .insert(eventData)
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
        description: "No se pudo crear el evento: " + error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      // Prepare the event data by removing empty strings for nullable fields
      const eventData = {
        ...updates,
        event_date: updates.event_date && updates.event_date.trim() !== "" ? updates.event_date : null,
        price: updates.price && updates.price?.trim() !== "" ? updates.price : null,
        location: updates.location && updates.location.trim() !== "" ? updates.location : null,
        reservation_link: updates.reservation_link && updates.reservation_link.trim() !== "" ? updates.reservation_link : null
      };
      
      const { data, error } = await supabase
        .from("events")
        .update(eventData)
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
        description: "No se pudo actualizar el evento: " + error.message,
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
        description: "No se pudo eliminar el evento: " + error.message,
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
