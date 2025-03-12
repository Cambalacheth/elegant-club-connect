
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { Event } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { useForumUser } from "@/hooks/useForumUser";
import { EventManagement } from "@/components/events/EventManagement";
import { canAdminContent } from "@/types/user";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "@/components/events/EventForm";
import { useEvents } from "@/hooks/useEvents";

const Events = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, userRole } = useForumUser();
  const isAdmin = canAdminContent(userRole);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Event operations
  const { fetchEvents, updateEvent, deleteEvent } = useEvents();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
        
      if (error) throw error;
      
      const now = new Date();
      const upcoming: Event[] = [];
      const past: Event[] = [];

      data.forEach(event => {
        if (event.event_date && isPast(new Date(event.event_date))) {
          past.push(event);
        } else {
          upcoming.push(event);
        }
      });
      
      // Sort upcoming events by date, with events without dates last
      upcoming.sort((a, b) => {
        if (!a.event_date) return 1;
        if (!b.event_date) return -1;
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      });
      
      // Sort past events by date, most recent first
      past.sort((a, b) => {
        if (!a.event_date) return 1;
        if (!b.event_date) return -1;
        return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleUpdateEvent = async (data: Partial<Event>) => {
    if (!editingEvent) return;
    
    try {
      setIsSubmitting(true);
      await updateEvent(editingEvent.id, data);
      await handleFetchEvents(); // Refresh the events list
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      await handleFetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const eventsTitle = language === "en" ? "Community Events" : "Eventos de la Comunidad";
  const upcomingEventsText = language === "en" ? "Upcoming Events" : "Próximos Eventos";
  const pastEventsText = language === "en" ? "Past Events" : "Eventos Pasados";
  const registerText = language === "en" ? "Register" : "Registrarse";
  const noEventsText = language === "en" 
    ? "No events scheduled at the moment." 
    : "No hay eventos programados en este momento.";
  const capacityText = language === "en" ? "Capacity" : "Capacidad";
  const locationText = language === "en" ? "Location" : "Ubicación";
  const dateToBeAnnouncedText = language === "en" ? "Date to be announced" : "Fecha por anunciar";
  const locationToBeAnnouncedText = language === "en" ? "Location to be announced" : "Ubicación por anunciar";

  const EventCard = ({ event, isPast = false }: { event: Event, isPast?: boolean }) => {
    const formattedDate = event.event_date 
      ? format(new Date(event.event_date), 'PPpp', {locale: language === "en" ? undefined : es})
      : dateToBeAnnouncedText;

    return (
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isPast ? 'opacity-70' : ''}`}>
        {event.image_url && (
          <div className="h-48 overflow-hidden">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-medium text-club-brown">{event.title}</h3>
            
            {isAdmin && (
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
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-club-brown/80">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            
            {event.location ? (
              <div className="flex items-center text-club-brown/80">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
            ) : (
              <div className="flex items-center text-club-brown/80">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{locationToBeAnnouncedText}</span>
              </div>
            )}
            
            {event.price && (
              <div className="flex items-center text-club-brown/80">
                <Clock className="h-4 w-4 mr-2" />
                <span>{event.price}</span>
              </div>
            )}
          </div>
          
          <p className="text-club-brown/80 mb-4">{event.description}</p>
          
          {!isPast && event.reservation_link && (
            <a 
              href={event.reservation_link} 
              className="inline-flex items-center bg-club-orange text-white px-4 py-2 rounded-full hover:bg-club-terracotta transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {registerText}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-club-brown">
            {eventsTitle}
          </h1>
          
          {isAdmin && (
            <div>
              <EventManagement />
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
          </div>
        ) : (
          <>
            <section className="mb-16">
              <h2 className="text-2xl font-serif text-club-brown mb-8 border-b border-club-brown/20 pb-2">
                {upcomingEventsText}
              </h2>
              
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-club-brown text-lg">{noEventsText}</p>
                </div>
              )}
            </section>
            
            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif text-club-brown mb-8 border-b border-club-brown/20 pb-2">
                  {pastEventsText}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastEvents.map(event => (
                    <EventCard key={event.id} event={event} isPast={true} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      
      {/* Edit Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white p-0 border-2 shadow-xl">
          <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
            <DialogTitle className="text-xl font-serif text-club-brown">
              {editingEvent ? 'Editar evento' : 'Nuevo Evento'}
            </DialogTitle>
          </DialogHeader>
          <div className="px-0 py-0">
            <EventForm
              initialData={editingEvent || undefined}
              onSubmit={handleUpdateEvent}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Events;
