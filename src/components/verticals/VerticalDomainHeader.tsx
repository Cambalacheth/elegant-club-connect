
import { VERTICAL_PATHS } from "@/hooks/useVerticalDomains";

interface VerticalDomainHeaderProps {
  currentPath: string;
  currentLanguage: string;
}

export const getVerticalInfo = (path: string, language: string) => {
  // Mapeo de rutas a información de verticales
  const verticalInfo = {
    "/tech": {
      title: language === "en" ? "Technology" : "Tecnología",
      description: language === "en" 
        ? "Explore technological innovations and digital transformation from experts in the field."
        : "Explora innovaciones tecnológicas y transformación digital de la mano de expertos en el campo.",
      image: "/lovable-uploads/89461e1d-3378-4375-86b6-c6d7130d20bf.png",
      color: "bg-blue-100"
    },
    "/arte": {
      title: language === "en" ? "Art" : "Arte",
      description: language === "en"
        ? "Discover creative expression and its impact on contemporary society."
        : "Descubre la expresión creativa y su impacto en la sociedad contemporánea.",
      image: "/lovable-uploads/38415027-1a0b-4427-a514-ed9f57475d6b.png",
      color: "bg-purple-100"
    },
    "/comunidad": {
      title: language === "en" ? "Community" : "Comunidad",
      description: language === "en"
        ? "Foster meaningful connections between opinion leaders committed to social development."
        : "Fomenta conexiones significativas entre líderes de opinión comprometidos con el desarrollo social.",
      image: "/lovable-uploads/444e9024-ca73-44d5-beb0-03e0794ffed5.png",
      color: "bg-green-100"
    },
    "/negocios": {
      title: language === "en" ? "Business" : "Negocios",
      description: language === "en"
        ? "Connect with top investors and financial leaders to exchange perspectives on global markets."
        : "Conecta con los principales inversores y líderes financieros para intercambiar perspectivas sobre mercados globales.",
      image: "/lovable-uploads/5996e8d4-20aa-4b4c-8776-8c3c3e60e75a.png",
      color: "bg-amber-100"
    },
    "/legal": {
      title: language === "en" ? "Legal" : "Legal",
      description: language === "en"
        ? "Legal experts share knowledge on legal trends, regulatory challenges, and implications of new technologies."
        : "Expertos legales comparten conocimientos sobre tendencias jurídicas, desafíos regulatorios e implicaciones de nuevas tecnologías.",
      image: "/lovable-uploads/ff2754af-03fe-4db7-bdd5-ac1532cdce5c.png",
      color: "bg-red-100"
    },
    "/salud": {
      title: language === "en" ? "Health" : "Salud",
      description: language === "en"
        ? "Bringing together medical professionals, researchers and innovators to discuss scientific advances."
        : "Reunimos a profesionales médicos, investigadores e innovadores para discutir avances científicos y el futuro de la medicina.",
      image: "/lovable-uploads/18c52db6-ebed-4c95-b8c3-c1324a653957.png",
      color: "bg-emerald-100"
    }
  };

  return verticalInfo[path as keyof typeof verticalInfo] || {
    title: language === "en" ? "Vertical Domain" : "Dominio Vertical",
    description: language === "en" ? "Explore this vertical domain" : "Explora este dominio vertical",
    image: "/placeholder.svg",
    color: "bg-gray-100"
  };
};

const VerticalDomainHeader = ({ currentPath, currentLanguage }: VerticalDomainHeaderProps) => {
  const info = getVerticalInfo(currentPath, currentLanguage);
  
  return (
    <div className={`pt-24 pb-12 ${info.color}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-full overflow-hidden shrink-0">
            <img 
              src={info.image} 
              alt={info.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-club-brown">
              {info.title}
            </h1>
            <p className="text-lg text-club-brown/80 max-w-2xl">
              {info.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalDomainHeader;
