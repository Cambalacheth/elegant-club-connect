
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import NavbarWithDefaultLang from "@/components/Navbar";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Check, Vote, Award, Star, Code, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VotePage = () => {
  const { user, userLevel, isLoading } = useUser();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const apiBaseUrl = "https://hunlwxpizenlsqcghffy.supabase.co/functions/v1/polls-api";

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
                Sistema de Votación API
              </h1>
              <p className="text-lg text-gray-600">
                Integra nuestro sistema de votaciones en tu propia plataforma mediante nuestra API REST.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-white shadow-sm border-club-beige hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5 text-club-orange" />
                    Endpoints de la API
                  </CardTitle>
                  <CardDescription>
                    Endpoints disponibles para integrar en tu aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-sm font-medium">GET /polls</div>
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                      </div>
                      <p className="text-sm text-gray-600">Obtener todas las encuestas</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-sm font-medium">GET /polls/:id</div>
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                      </div>
                      <p className="text-sm text-gray-600">Obtener una encuesta específica</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-sm font-medium">POST /polls</div>
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                      </div>
                      <p className="text-sm text-gray-600">Crear una nueva encuesta</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-sm font-medium">POST /vote</div>
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                      </div>
                      <p className="text-sm text-gray-600">Registrar un voto en una encuesta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border-club-beige hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-club-orange" />
                    Ejemplos de Código
                  </CardTitle>
                  <CardDescription>
                    Ejemplos para integrar en tu aplicación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs leading-relaxed">
                    {`// Obtener todas las encuestas
fetch('${apiBaseUrl}/polls')
  .then(res => res.json())
  .then(data => console.log(data));

// Obtener encuesta específica
fetch('${apiBaseUrl}/polls/[ID]')
  .then(res => res.json())
  .then(data => console.log(data));

// Crear encuesta
fetch('${apiBaseUrl}/polls', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Tu pregunta',
    options: ['Opción 1', 'Opción 2']
  })
});

// Registrar voto
fetch('${apiBaseUrl}/vote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pollId: '[POLL_ID]',
    optionId: '[OPTION_ID]',
    userId: '[USER_ID]'
  })
});`}
                  </pre>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-club-orange to-club-terracotta p-6 rounded-lg text-white shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Star className="h-6 w-6" />
                    Documentación completa
                  </h2>
                  <p className="text-white/90">
                    Visita nuestra documentación para obtener información detallada sobre cómo integrar nuestro sistema de votaciones
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  className="mt-4 md:mt-0 bg-white text-club-brown hover:bg-club-beige transition-colors"
                >
                  Ver documentación <ExternalLink className="ml-2 h-4 w-4" />
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
