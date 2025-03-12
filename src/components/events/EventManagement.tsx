
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventForm } from "./EventForm";
import { Event } from "@/types/event";
import { useEvents } from "@/hooks/useEvents";

export const EventManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const {
    createEvent,
    updateEvent,
    fetchEvents
  } = useEvents();

  const handleCreateEvent = async (data: Partial<Event>) => {
    try {
      setIsSubmitting(true);
      await createEvent(data as Omit<Event, "id" | "created_at" | "updated_at">);
      await fetchEvents(); // Refresh the events list
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async (data: Partial<Event>) => {
    if (!editingEvent) return;
    
    try {
      setIsSubmitting(true);
      await updateEvent(editingEvent.id, data);
      await fetchEvents(); // Refresh the events list
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEventClick = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="bg-gradient-to-br from-club-orange-mid to-club-terracotta hover:opacity-90 text-white font-medium shadow-md transition-all"
          onClick={handleNewEventClick}
        >
          <Plus className="mr-2 h-5 w-5" /> Nuevo evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white p-0 border-2 shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
          <DialogTitle className="text-xl font-serif text-club-brown">
            {editingEvent ? 'Editar evento' : 'Nuevo Evento'}
          </DialogTitle>
        </DialogHeader>
        <div className="px-0 py-0">
          <EventForm
            initialData={editingEvent || undefined}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
