
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import { Event } from "@/types/event";
import { CreateEventData } from "./types";

interface EditEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: Event | null;
  onSubmit: (data: CreateEventData) => Promise<void>;
  isSubmitting: boolean;
}

export const EditEventDialog = ({
  isOpen,
  onOpenChange,
  editingEvent,
  onSubmit,
  isSubmitting
}: EditEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-2 border-club-beige/50 shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
          <DialogTitle className="text-xl font-serif text-club-brown">
            {editingEvent ? 'Editar evento' : 'Nuevo Evento'}
          </DialogTitle>
        </DialogHeader>
        <div className="px-0 py-0">
          <EventForm
            initialData={editingEvent || undefined}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
