
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VerticalProps {
  image: string;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
  path: string;
}

const VerticalCard = ({ image, title, description, delay, isVisible, path }: VerticalProps) => {
  return (
    <Link 
      to={path}
      className={`bg-club-beige p-6 rounded-xl shadow-sm border border-club-beige/50 transition-all duration-1000 transform hover:shadow-md hover:scale-105 cursor-pointer h-full flex flex-col ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
        />
      </div>
      <h3 className="text-xl font-serif font-semibold text-club-black mb-3">{title}</h3>
      <p className="text-club-brown leading-relaxed mt-auto">{description}</p>
    </Link>
  );
};

const VerticalsCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const verticals = [
    {
      image: "/lovable-uploads/89461e1d-3378-4375-86b6-c6d7130d20bf.png",
      title: "Tecnología",
      description: "Innovadores y visionarios tecnológicos comparten perspectivas sobre transformación digital y tecnologías emergentes.",
      delay: 100,
      path: "/tech"
    },
    {
      image: "/lovable-uploads/38415027-1a0b-4427-a514-ed9f57475d6b.png",
      title: "Arte",
      description: "Un espacio para artistas, coleccionistas y entusiastas que valoran la expresión creativa y su impacto en la sociedad contemporánea.",
      delay: 200,
      path: "/arte"
    },
    {
      image: "/lovable-uploads/444e9024-ca73-44d5-beb0-03e0794ffed5.png",
      title: "Comunidad",
      description: "Fomentamos conexiones significativas entre líderes de opinión comprometidos con el desarrollo social y comunitario.",
      delay: 300,
      path: "/comunidad"
    },
    {
      image: "/lovable-uploads/5996e8d4-20aa-4b4c-8776-8c3c3e60e75a.png",
      title: "Finanzas",
      description: "Conectamos a los principales inversores y líderes financieros para intercambiar perspectivas sobre mercados globales y oportunidades de inversión.",
      delay: 400,
      path: "/negocios"
    },
    {
      image: "/lovable-uploads/ff2754af-03fe-4db7-bdd5-ac1532cdce5c.png",
      title: "Derecho",
      description: "Expertos legales comparten conocimientos sobre tendencias jurídicas, desafíos regulatorios e implicaciones legales de nuevas tecnologías.",
      delay: 500,
      path: "/legal"
    },
    {
      image: "/lovable-uploads/18c52db6-ebed-4c95-b8c3-c1324a653957.png",
      title: "Salud",
      description: "Reunimos a profesionales médicos, investigadores e innovadores para discutir avances científicos y el futuro de la medicina.",
      delay: 600,
      path: "/salud"
    },
  ];

  return (
    <section 
      id="verticals"
      ref={sectionRef}
      className="py-20 bg-club-beige relative overflow-hidden"
    >
      {/* Background Design Element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-club-olive/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span 
            className={`inline-block bg-club-olive/20 text-club-brown px-4 py-1.5 rounded-full text-sm font-medium mb-6 transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Nuestras Verticales
          </span>
          
          <h2 
            className={`text-3xl md:text-4xl font-semibold text-club-brown mb-6 transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Seis áreas de conocimiento, infinitas posibilidades
          </h2>
          
          <p 
            className={`text-lg text-club-brown/90 transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Cada vertical representa un pilar de nuestra comunidad, donde expertos comparten conocimientos y crean sinergias entre disciplinas.
          </p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {verticals.map((vertical, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                <VerticalCard
                  image={vertical.image}
                  title={vertical.title}
                  description={vertical.description}
                  delay={vertical.delay}
                  isVisible={isVisible}
                  path={vertical.path}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-club-terracotta text-white border-none absolute -left-4 hover:bg-club-terracotta/90" />
          <CarouselNext className="bg-club-terracotta text-white border-none absolute -right-4 hover:bg-club-terracotta/90" />
        </Carousel>
      </div>
    </section>
  );
};

export default VerticalsCarousel;
