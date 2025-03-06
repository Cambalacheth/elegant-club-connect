
import { useState, useEffect, useRef } from "react";
import { 
  Briefcase, 
  Stethoscope, 
  Scale, 
  PaintBucket, 
  Users, 
  Cpu 
} from "lucide-react";

interface VerticalProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
}

const VerticalCard = ({ icon, title, description, delay, isVisible }: VerticalProps) => {
  return (
    <div 
      className={`bg-club-beige p-6 rounded-xl shadow-sm border border-club-beige/50 transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 bg-club-terracotta/10 rounded-full flex items-center justify-center mb-6 text-club-terracotta">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-semibold text-club-black mb-3">{title}</h3>
      <p className="text-club-brown leading-relaxed">{description}</p>
    </div>
  );
};

const VerticalsSection = () => {
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
      icon: <Briefcase size={28} />,
      title: "Finanzas",
      description: "Conectamos a los principales inversores y líderes financieros para intercambiar perspectivas sobre mercados globales y oportunidades de inversión.",
      delay: 100,
    },
    {
      icon: <Stethoscope size={28} />,
      title: "Salud",
      description: "Reunimos a profesionales médicos, investigadores e innovadores para discutir avances científicos y el futuro de la medicina.",
      delay: 200,
    },
    {
      icon: <Scale size={28} />,
      title: "Derecho",
      description: "Expertos legales comparten conocimientos sobre tendencias jurídicas, desafíos regulatorios e implicaciones legales de nuevas tecnologías.",
      delay: 300,
    },
    {
      icon: <PaintBucket size={28} />,
      title: "Arte",
      description: "Un espacio para artistas, coleccionistas y entusiastas que valoran la expresión creativa y su impacto en la sociedad contemporánea.",
      delay: 400,
    },
    {
      icon: <Users size={28} />,
      title: "Comunidad",
      description: "Fomentamos conexiones significativas entre líderes de opinión comprometidos con el desarrollo social y comunitario.",
      delay: 500,
    },
    {
      icon: <Cpu size={28} />,
      title: "Tecnología",
      description: "Innovadores y visionarios tecnológicos comparten perspectivas sobre transformación digital y tecnologías emergentes.",
      delay: 600,
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
        <div className="text-center max-w-3xl mx-auto mb-16">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verticals.map((vertical, index) => (
            <VerticalCard
              key={index}
              icon={vertical.icon}
              title={vertical.title}
              description={vertical.description}
              delay={vertical.delay}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VerticalsSection;
