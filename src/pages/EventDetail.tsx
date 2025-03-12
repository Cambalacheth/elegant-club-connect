
import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "../components/Navbar";
import { Event } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { useEventTexts } from "@/hooks/useEventTexts";
import { Button } from "@/components/ui/button";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [language, setLanguage] = useState("es");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const texts = useEventTexts(language);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
    }
  }, [location]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-club-beige flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar currentLanguage={language} />
        <div className="container mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-serif text-club-brown mb-6">
            {language === "en" ? "Event not found" : "Evento no encontrado"}
          </h1>
          <Link to="/events">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "en" ? "Back to Events" : "Volver a Eventos"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = event.event_date 
    ? format(new Date(event.event_date), 'PPpp', {locale: language === "en" ? undefined : es})
    : texts.dateToBeAnnouncedText;

  const isPast = event.event_date ? new Date(event.event_date) < new Date() : false;

  return (
    <div className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <Link to="/events" className="inline-flex items-center text-club-brown hover:text-club-orange mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Events" : "Volver a Eventos"}
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {event.image_url && (
            <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-serif text-club-brown mb-6">
              {event.title}
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-club-brown/80">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span className="text-lg">{formattedDate}</span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-club-brown/80">
                    <MapPin className="h-5 w-5 mr-3" />
                    <span className="text-lg">{event.location}</span>
                  </div>
                )}
                
                {event.price && (
                  <div className="flex items-center text-club-brown/80">
                    <Clock className="h-5 w-5 mr-3" />
                    <span className="text-lg">{event.price}</span>
                  </div>
                )}
              </div>
              
              <div>
                {!isPast && event.reservation_link && (
                  <a 
                    href={event.reservation_link} 
                    className="inline-flex items-center bg-club-orange text-white px-6 py-3 rounded-full hover:bg-club-terracotta transition-colors text-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {texts.registerText}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-club-brown">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
