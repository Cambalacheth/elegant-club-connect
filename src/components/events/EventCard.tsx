
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  isPast?: boolean;
  language: string;
  isAdmin?: boolean;
  onEditClick?: (event: Event) => void;
  onDeleteClick?: (id: string) => void;
  registerText?: string;
  dateToBeAnnouncedText?: string;
  locationToBeAnnouncedText?: string;
}

export const EventCard = ({
  event,
  isPast = false,
  language,
  isAdmin = false,
  onEditClick,
  onDeleteClick,
  registerText = language === "en" ? "Register" : "Registrarse",
  dateToBeAnnouncedText = language === "en" ? "Date to be announced" : "Fecha por anunciar",
  locationToBeAnnouncedText = language === "en" ? "Location to be announced" : "Ubicación por anunciar"
}: EventCardProps) => {
  const { id, title, description, event_date, location, image_url, capacity } = event;
  
  const formattedDate = event_date 
    ? new Date(event_date).toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : dateToBeAnnouncedText;
  
  const displayLocation = location || locationToBeAnnouncedText;
  
  // Translations based on language
  const capacityText = language === "en" ? "Capacity" : "Capacidad";
  const deleteConfirmText = language === "en" ? "Are you sure?" : "¿Estás seguro?";
  const deleteConfirmDesc = language === "en" 
    ? "This action cannot be undone." 
    : "Esta acción no se puede deshacer.";
  const cancelText = language === "en" ? "Cancel" : "Cancelar";
  const deleteText = language === "en" ? "Delete" : "Eliminar";
  const editText = language === "en" ? "Edit" : "Editar";
  const adminActionsText = language === "en" ? "Admin actions" : "Acciones de administrador";
  const freeText = language === "en" ? "Free" : "Gratuito";
  const viewDetailsText = language === "en" ? "View Details" : "Ver Detalles";
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Event Image */}
      {image_url ? (
        <div className="h-48 relative overflow-hidden">
          <img 
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-club-beige-dark to-club-beige/70 flex items-center justify-center">
          <span className="text-club-brown/50 font-serif text-xl">
            {language === "en" ? "Terreta Hub Event" : "Evento de Terreta Hub"}
          </span>
        </div>
      )}
      
      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="bg-club-beige/50 text-club-brown border-0 font-normal">
            {event.category || (language === "en" ? "Community" : "Comunidad")}
          </Badge>
          
          {isAdmin && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">{adminActionsText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEditClick && (
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => onEditClick(event)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>{editText}</span>
                    </DropdownMenuItem>
                  )}
                  
                  {onDeleteClick && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>{deleteText}</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{deleteConfirmText}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {deleteConfirmDesc}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteClick(id)}
                          >
                            {deleteText}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <h3 className="text-xl font-serif font-medium text-club-brown mb-2">{title}</h3>
        
        <p className="text-club-brown/80 mb-4 line-clamp-2 text-sm">
          {description}
        </p>
        
        <div className="space-y-2 mb-6 text-sm">
          <div className="flex items-center text-club-brown/70">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-club-brown/70">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{displayLocation}</span>
          </div>
          
          {capacity && (
            <div className="flex items-center text-club-brown/70">
              <Users className="mr-2 h-4 w-4" />
              <span>{capacityText}: {capacity}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-green-600 font-medium">
            {event.price ? `${event.price}€` : freeText}
          </div>
          
          {!isPast ? (
            <Link to={`/events/${id}`}>
              <Button className="bg-club-orange hover:bg-club-terracotta text-white">
                {registerText}
              </Button>
            </Link>
          ) : (
            <Link to={`/events/${id}`}>
              <Button variant="outline">
                {viewDetailsText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
