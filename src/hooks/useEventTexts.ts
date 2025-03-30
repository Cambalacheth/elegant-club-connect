
export const useEventTexts = (language: string) => {
  return {
    eventsTitle: language === "en" ? "Community Events" : "Eventos de la Comunidad",
    upcomingEventsText: language === "en" ? "Upcoming Events" : "Próximos Eventos",
    pastEventsText: language === "en" ? "Past Events" : "Eventos Pasados",
    registerText: language === "en" ? "Register" : "Registrarse",
    noEventsText: language === "en" 
      ? "No events are currently scheduled. Check back soon for upcoming gatherings!" 
      : "No hay eventos programados en este momento.",
    capacityText: language === "en" ? "Capacity" : "Capacidad",
    locationText: language === "en" ? "Location" : "Ubicación",
    dateToBeAnnouncedText: language === "en" ? "Date to be announced" : "Fecha por anunciar",
    locationToBeAnnouncedText: language === "en" ? "Location to be announced" : "Ubicación por anunciar",
    joinEventText: language === "en" ? "Join Event" : "Unirse al Evento",
    freeText: language === "en" ? "Free" : "Gratuito",
    eventDetailsText: language === "en" ? "Event Details" : "Detalles del Evento",
    organizerText: language === "en" ? "Organizer" : "Organizador",
    shareEventText: language === "en" ? "Share Event" : "Compartir Evento",
  };
};
