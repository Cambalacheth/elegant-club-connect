
import { Event } from "@/types/event";
import { EventCard } from "./EventCard";

interface EventsSectionProps {
  title: string;
  events: Event[];
  isPast?: boolean;
  noEventsText: string;
  language: string;
  isAdmin: boolean;
  onEditClick: (event: Event) => void;
  onDeleteClick: (id: string) => void;
  registerText: string;
  dateToBeAnnouncedText: string;
  locationToBeAnnouncedText: string;
}

export const EventsSection = ({
  title,
  events,
  isPast = false,
  noEventsText,
  language,
  isAdmin,
  onEditClick,
  onDeleteClick,
  registerText,
  dateToBeAnnouncedText,
  locationToBeAnnouncedText
}: EventsSectionProps) => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-serif text-club-brown mb-8 border-b border-club-brown/20 pb-2">
        {title}
      </h2>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              isPast={isPast}
              language={language}
              isAdmin={isAdmin}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              registerText={registerText}
              dateToBeAnnouncedText={dateToBeAnnouncedText}
              locationToBeAnnouncedText={locationToBeAnnouncedText}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-club-brown text-lg">{noEventsText}</p>
        </div>
      )}
    </section>
  );
};
