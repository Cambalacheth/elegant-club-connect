
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Event } from "@/types/event";
import { isPast } from "date-fns";
import { useUser } from "@/hooks/useUser";
import { EventManagement } from "@/components/events/EventManagement";
import { canAdminContent } from "@/types/user";
import { useEventTexts } from "@/hooks/useEventTexts";
import { EventsSection } from "@/components/events/EventsSection";
import { EditEventDialog } from "@/components/events/EditEventDialog";
import { useEvents } from "@/hooks/useEvents";

const Events = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const { userRole } = useUser();
  const isAdmin = canAdminContent(userRole);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Event operations
  const { events, isLoading, fetchEvents, updateEvent, deleteEvent, createEvent } = useEvents();

  // Get language-specific texts
  const texts = useEventTexts(language);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
    }
  }, [location]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Process events whenever the events array changes
  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const upcoming: Event[] = [];
      const past: Event[] = [];

      events.forEach(event => {
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
    } else {
      setUpcomingEvents([]);
      setPastEvents([]);
    }
  }, [events]);

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
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

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      await fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-club-brown">
            {texts.eventsTitle}
          </h1>
          
          {isAdmin && (
            <div>
              <EventManagement onEventAdded={fetchEvents} />
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
          </div>
        ) : (
          <>
            <EventsSection 
              title={texts.upcomingEventsText}
              events={upcomingEvents}
              noEventsText={texts.noEventsText}
              language={language}
              isAdmin={isAdmin}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteEvent}
              registerText={texts.registerText}
              dateToBeAnnouncedText={texts.dateToBeAnnouncedText}
              locationToBeAnnouncedText={texts.locationToBeAnnouncedText}
            />
            
            <EventsSection 
              title={texts.pastEventsText}
              events={pastEvents}
              isPast={true}
              noEventsText={texts.noEventsText}
              language={language}
              isAdmin={isAdmin}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteEvent}
              registerText={texts.registerText}
              dateToBeAnnouncedText={texts.dateToBeAnnouncedText}
              locationToBeAnnouncedText={texts.locationToBeAnnouncedText}
            />
          </>
        )}
      </div>
      
      <EditEventDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEvent={editingEvent}
        onSubmit={handleUpdateEvent}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default Events;
