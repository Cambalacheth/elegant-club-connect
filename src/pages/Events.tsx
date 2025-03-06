
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  capacity?: number;
  registrationLink?: string;
}

const Events = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  useEffect(() => {
    // In a real app, you would fetch events from your database
    // Here we're using sample data
    const sampleEvents: Event[] = [
      {
        id: "1",
        title: language === "en" ? "Workshop: Introduction to Web3" : "Taller: Introducción a Web3",
        description: language === "en" 
          ? "Learn the basics of Web3 technology and blockchain fundamentals in this interactive workshop." 
          : "Aprende los conceptos básicos de la tecnología Web3 y los fundamentos de blockchain en este taller interactivo.",
        date: "2023-12-15",
        time: "18:00",
        location: "Terreta Hub, Valencia",
        imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?q=80&w=2340&auto=format&fit=crop",
        capacity: 30,
        registrationLink: "#"
      },
      {
        id: "2",
        title: language === "en" ? "Networking Event: Tech in Valencia" : "Evento de Networking: Tech en Valencia",
        description: language === "en"
          ? "Connect with other tech professionals in Valencia and expand your network."
          : "Conéctate con otros profesionales de tecnología en Valencia y expande tu red.",
        date: "2023-12-20",
        time: "19:30",
        location: "Coworking Space, Valencia",
        imageUrl: "https://images.unsplash.com/photo-1511795409834-432f7b667e35?q=80&w=2340&auto=format&fit=crop",
        capacity: 50,
        registrationLink: "#"
      },
      {
        id: "3",
        title: language === "en" ? "Terreta Hub Annual Gala" : "Gala Anual de Terreta Hub",
        description: language === "en"
          ? "Join us for our annual gala dinner celebrating our community achievements."
          : "Únete a nuestra cena de gala anual celebrando los logros de nuestra comunidad.",
        date: "2024-01-15",
        time: "20:00",
        location: "Hotel Valencia Palace",
        imageUrl: "https://images.unsplash.com/photo-1562510044-edc87c246d73?q=80&w=2340&auto=format&fit=crop",
        capacity: 100,
        registrationLink: "#"
      },
      {
        id: "4",
        title: language === "en" ? "Web Development Workshop" : "Taller de Desarrollo Web",
        description: language === "en"
          ? "A workshop focused on modern web development techniques and best practices."
          : "Un taller enfocado en técnicas modernas de desarrollo web y mejores prácticas.",
        date: "2023-10-10", // Past event
        time: "17:00",
        location: "Online",
        imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2331&auto=format&fit=crop",
      },
    ];

    // Split events into upcoming and past based on date
    const now = new Date();
    const upcoming: Event[] = [];
    const past: Event[] = [];

    sampleEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Sort upcoming events by date (closest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Sort past events by date (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, [language]);

  // Text based on selected language
  const eventsTitle = language === "en" ? "Community Events" : "Eventos de la Comunidad";
  const upcomingEventsText = language === "en" ? "Upcoming Events" : "Próximos Eventos";
  const pastEventsText = language === "en" ? "Past Events" : "Eventos Pasados";
  const registerText = language === "en" ? "Register" : "Registrarse";
  const noEventsText = language === "en" 
    ? "No events scheduled at the moment." 
    : "No hay eventos programados en este momento.";
  const capacityText = language === "en" ? "Capacity" : "Capacidad";
  const locationText = language === "en" ? "Location" : "Ubicación";

  const EventCard = ({ event, isPast = false }: { event: Event, isPast?: boolean }) => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    return (
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isPast ? 'opacity-70' : ''}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-medium text-club-brown mb-3">{event.title}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-club-brown/80">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center text-club-brown/80">
              <Clock className="h-4 w-4 mr-2" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-club-brown/80">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
            
            {event.capacity && (
              <div className="flex items-center text-club-brown/80">
                <Users className="h-4 w-4 mr-2" />
                <span>{capacityText}: {event.capacity}</span>
              </div>
            )}
          </div>
          
          <p className="text-club-brown/80 mb-4">{event.description}</p>
          
          {!isPast && event.registrationLink && (
            <a 
              href={event.registrationLink} 
              className="inline-flex items-center bg-club-orange text-white px-4 py-2 rounded-full hover:bg-club-terracotta transition-colors"
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
        <h1 className="text-4xl md:text-5xl font-serif text-club-brown text-center mb-12">
          {eventsTitle}
        </h1>
        
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
      </div>
      
      <Footer />
    </main>
  );
};

export default Events;
