
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import NavbarWithDefaultLang from "@/components/Navbar";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Check, Vote, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VotePage = () => {
  const { user, userLevel, isLoading } = useUser();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);

  const handleVoteClick = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas iniciar sesión para participar",
        variant: "destructive",
      });
      return;
    }

    setIsVoting(true);
    
    // In a real application, this would perform an actual vote action
    // For now, just simulate a delay and show a success message
    setTimeout(() => {
      toast({
        title: "¡Gracias por tu voto!",
        description: "Tu participación ha sido registrada",
      });
      setIsVoting(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Vote | Terreta Hub</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-club-beige-light to-white">
        <NavbarWithDefaultLang />
        
        <main className="container mx-auto pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-club-brown mb-4">
                Sistema de Votación
              </h1>
              <p className="text-lg text-gray-600">
                Tu voz es importante en la comunidad de Terreta. Participa en nuestro 
                sistema de votación para influir en las decisiones futuras.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-white shadow-sm border-club-beige hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5 text-club-orange" />
                    Votaciones Activas
                  </CardTitle>
                  <CardDescription>
                    Participa en las decisiones de la comunidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-club-beige/20 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No hay votaciones activas en este momento</p>
                    <p className="text-sm mt-2">Las nuevas votaciones se anunciarán pronto</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border-club-beige hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-club-orange" />
                    Recompensas
                  </CardTitle>
                  <CardDescription>
                    Gana XP y desbloquea beneficios por participar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>+5 XP por cada voto en un debate o comentario</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>+10 XP por cada comentario que publiques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>+50 XP por cada debate que inicies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-club-orange to-club-terracotta p-6 rounded-lg text-white shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Star className="h-6 w-6" />
                    Promoción especial
                  </h2>
                  <p className="text-white/90">
                    Participa en nuestro foro y gana el doble de XP durante este mes
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  className="mt-4 md:mt-0 bg-white text-club-brown hover:bg-club-beige transition-colors"
                  onClick={handleVoteClick}
                  disabled={isVoting}
                >
                  {isVoting ? "Procesando..." : "Participar ahora"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VotePage;
