
import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { Event } from "@/types/event";
import { useEvents } from "@/hooks/useEvents";

interface EventManagementProps {
  onEventAdded?: () => void;
}

// Define a type for the form data that matches what createEvent expects
type CreateEventData = {
  title: string;
  description: string;
  location?: string;
  price?: string;
  event_date?: string;
  image_url?: string;
  reservation_link?: string;
};

export const EventManagement = ({ onEventAdded }: EventManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEvent, updateEvent } = useEvents();

  const handleSubmitEvent = async (data: CreateEventData) => {
    try {
      setIsSubmitting(true);
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        await createEvent(data);
      }
      
      setIsDialogOpen(false);
      
      if (onEventAdded) {
        onEventAdded();
      }
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white p-0 border-2 shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
          <DialogTitle className="text-xl font-serif text-club-brown">
            Nuevo Evento
          </DialogTitle>
          <DialogDescription>
            Crea un nuevo evento para la comunidad.
          </DialogDescription>
        </DialogHeader>
        <div className="px-0 py-0">
          <EventForm
            onSubmit={handleSubmitEvent}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
