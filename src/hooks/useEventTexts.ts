
export const useEventTexts = (language: string) => {
  return {
    eventsTitle: language === "en" ? "Community Events" : "Eventos de la Comunidad",
    upcomingEventsText: language === "en" ? "Upcoming Events" : "Próximos Eventos",
    pastEventsText: language === "en" ? "Past Events" : "Eventos Pasados",
    registerText: language === "en" ? "Register" : "Registrarse",
    noEventsText: language === "en" 
      ? "No events scheduled at the moment." 
      : "No hay eventos programados en este momento.",
    capacityText: language === "en" ? "Capacity" : "Capacidad",
    locationText: language === "en" ? "Location" : "Ubicación",
    dateToBeAnnouncedText: language === "en" ? "Date to be announced" : "Fecha por anunciar",
    locationToBeAnnouncedText: language === "en" ? "Location to be announced" : "Ubicación por anunciar",
  };
};
