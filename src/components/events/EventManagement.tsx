
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { EventForm } from "./EventForm";
import { Event } from "@/types/event";
import { useEvents } from "@/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const EventManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const {
    events,
    isLoading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (data: Partial<Event>) => {
    try {
      setIsSubmitting(true);
      await createEvent(data as Omit<Event, "id" | "created_at" | "updated_at">);
      fetchEvents();
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
      fetchEvents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleNewEventClick = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-club-brown">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-club-brown">Administración de Eventos</h2>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <Card className="col-span-full bg-club-beige/30">
            <CardContent className="p-6 text-center">
              <p className="text-club-brown">No hay eventos disponibles. Comienza creando uno nuevo.</p>
            </CardContent>
          </Card>
        ) : (
          events.map(event => (
            <Card key={event.id} className="overflow-hidden">
              {event.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image_url} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-club-brown">{event.title}</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditClick(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente este evento.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteEvent(event.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <p className="text-sm text-club-brown/80 mb-3 line-clamp-2">{event.description}</p>
                
                {event.event_date && (
                  <p className="text-xs text-club-brown/70">
                    Fecha: {format(new Date(event.event_date), 'PPpp', {locale: es})}
                  </p>
                )}
                
                {event.location && (
                  <p className="text-xs text-club-brown/70">Ubicación: {event.location}</p>
                )}
                
                {event.price && (
                  <p className="text-xs text-club-brown/70">Precio: {event.price}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
