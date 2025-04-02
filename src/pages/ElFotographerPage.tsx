
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const ElFotographerPage = () => {
  return (
    <>
      <Helmet>
        <title>ElFotographer - Terreta Hub</title>
        <meta name="description" content="Página personal de ElFotographer en Terreta Hub" />
      </Helmet>

      <Navbar currentLanguage="es" />
      
      <div className="bg-gradient-to-b from-club-beige/50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-club-brown mb-4">
                ElFotographer
              </h1>
              <p className="text-xl text-club-terracotta">
                Capturando momentos, creando recuerdos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="relative h-[300px] bg-club-terracotta/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-lg text-club-brown font-medium">Imagen de muestra</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-2">Fotografía de Paisajes</h3>
                  <p className="text-muted-foreground">
                    Especializado en capturar la belleza natural de España, desde las costas mediterráneas hasta los Pirineos.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="relative h-[300px] bg-club-terracotta/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-lg text-club-brown font-medium">Imagen de muestra</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-2">Retratos Artísticos</h3>
                  <p className="text-muted-foreground">
                    Capturo la esencia de las personas a través de retratos que cuentan historias y transmiten emociones.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-club-beige/30 rounded-lg p-8 mb-12">
              <h2 className="font-serif text-3xl font-semibold text-club-brown mb-4">
                Sobre Mí
              </h2>
              <p className="mb-4">
                Soy un fotógrafo apasionado con más de 5 años de experiencia en fotografía artística y comercial.
                Mi enfoque se centra en capturar la luz natural y las emociones auténticas.
              </p>
              <p>
                Como miembro activo de Terreta Hub, busco colaborar con otros creativos y compartir mi pasión por la fotografía.
                Este espacio es mi dominio personal dentro de la comunidad, donde comparto mi trabajo y conecto con otros miembros.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="font-serif text-2xl font-semibold text-club-brown mb-4">
                ¿Interesado en colaborar?
              </h3>
              <p className="mb-6">
                Estoy abierto a colaboraciones y proyectos creativos con otros miembros de Terreta Hub.
              </p>
              <a 
                href="/user/elfotographer" 
                className="bg-club-orange text-white px-6 py-3 rounded-full btn-hover-effect inline-block"
              >
                Ver mi perfil completo
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElFotographerPage;
