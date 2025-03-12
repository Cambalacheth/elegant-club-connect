
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, MapPin, Clock, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface EventCardProps {
  event: Event;
  isPast?: boolean;
  language: string;
  isAdmin: boolean;
  onEditClick: (event: Event) => void;
  onDeleteClick: (id: string) => void;
  registerText: string;
  dateToBeAnnouncedText: string;
  locationToBeAnnouncedText: string;
}

export const EventCard = ({
  event,
  isPast = false,
  language,
  isAdmin,
  onEditClick,
  onDeleteClick,
  registerText,
  dateToBeAnnouncedText,
  locationToBeAnnouncedText
}: EventCardProps) => {
  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), 'PPpp', {locale: language === "en" ? undefined : es})
    : dateToBeAnnouncedText;

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isPast ? 'opacity-70' : ''}`}>
      <Link to={`/events/${event.id}`} className="block">
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
          
          <p className="text-club-brown/80 mb-4 line-clamp-3">{event.description}</p>
        </div>
      </Link>
      
      <div className="px-6 pb-6 flex justify-between items-center">
        {!isPast && event.reservation_link && (
          <a 
            href={event.reservation_link} 
            className="inline-flex items-center bg-club-orange text-white px-4 py-2 rounded-full hover:bg-club-terracotta transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {registerText}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        )}
        
        {isAdmin && (
          <div className="flex space-x-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditClick(event);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
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
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteClick(event.id);
                    }}
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
    </div>
  );
};
