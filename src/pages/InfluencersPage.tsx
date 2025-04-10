
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useForumUser } from "@/hooks/useForumUser";
import { useInfluencerProgram } from "@/hooks/useInfluencerProgram";
import Navbar from "@/components/Navbar";

const InfluencersPage: React.FC = () => {
  const { user } = useForumUser();
  const navigate = useNavigate();
  const { hasInteracted, isLoading, registerInterest } = useInfluencerProgram(user?.id);
  
  const handleInterestClick = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    await registerInterest();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-club-beige/30">
      <Navbar currentLanguage="es" />
      <div className="container py-12 px-4 mx-auto max-w-5xl pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-club-brown font-bold mb-4">
            Programa de Influencers
          </h1>
          <p className="text-xl text-club-brown/80 max-w-2xl mx-auto">
            Únete a nuestra comunidad de creadores y expande tu alcance mientras compartes tu pasión
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-8 mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-serif text-club-brown font-bold mb-4">
                Conviértete en influencer
              </h2>
              <p className="text-club-brown/70 mb-4">
                Buscamos personas apasionadas que quieran compartir su conocimiento y experiencia con nuestra comunidad.
              </p>
              <p className="text-club-brown/70 mb-4">
                Como influencer de TerretaHub, tendrás acceso a:
              </p>
              <ul className="list-disc pl-5 text-club-brown/70 mb-6 space-y-2">
                <li>Herramientas exclusivas para creadores</li>
                <li>Promoción en nuestras redes sociales</li>
                <li>Acceso anticipado a eventos y recursos</li>
                <li>Oportunidades de colaboración</li>
                <li>Recompensas basadas en tu participación</li>
              </ul>
              
              <Button
                onClick={handleInterestClick}
                disabled={isLoading || hasInteracted}
                className={`mt-4 text-white font-medium px-6 py-2 rounded-lg transition-all shadow-md ${
                  hasInteracted 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-gradient-to-r from-club-orange to-club-terracotta hover:opacity-90"
                }`}
              >
                <Heart className="mr-2 h-5 w-5" />
                {hasInteracted ? "¡Interés registrado!" : "Estoy interesado"}
              </Button>
              
              {!user && (
                <p className="text-sm text-club-brown/50 mt-2">
                  Necesitas iniciar sesión para participar
                </p>
              )}
            </div>
            
            <div className="rounded-lg overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Programa de influencers" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-club-brown mb-3">Crea contenido</h3>
            <p className="text-club-brown/70">
              Comparte tu expertise a través de artículos, videos o guías para nuestra comunidad.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-club-brown mb-3">Conecta</h3>
            <p className="text-club-brown/70">
              Establece conexiones con otros miembros y expande tu red de contactos profesionales.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-club-brown mb-3">Crece</h3>
            <p className="text-club-brown/70">
              Desarrolla tu presencia online y amplía tu audiencia con nuestro apoyo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencersPage;
