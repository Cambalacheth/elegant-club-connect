
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ExternalLink, Camera, Utensils, Vote } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  icon: JSX.Element;
}

const Projects = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish

  useEffect(() => {
    // Extract language from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "es" || langParam === "en")) {
      setLanguage(langParam);
      console.log(`Language set to: ${langParam}`);
    }
  }, [location]);

  // Text based on selected language
  const pageTitle = language === "en" ? "Community Projects" : "Proyectos de la Comunidad";
  const viewProjectText = language === "en" ? "View Project" : "Ver Proyecto";

  const projects: Project[] = [
    {
      id: "photographer",
      title: "El Photographer",
      description: language === "en" 
        ? "An audiovisual production about a journalist and a psychologist investigating an elusive urban artist." 
        : "Producción audiovisual sobre una periodista y un psicólogo investigando a un artista urbano furtivo.",
      imageUrl: "/lovable-uploads/fa1c453f-499e-4a12-afcc-6dcf06ebebba.png",
      websiteUrl: "https://stealthy-capture-experience.lovable.app/",
      icon: <Camera className="w-5 h-5" />
    },
    {
      id: "calorie-pilot",
      title: "Calorie Pilot",
      description: language === "en" 
        ? "Mobile application for tracking and managing calories and macros." 
        : "Aplicación móvil para trackeo y manejo de calorías y macros.",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      websiteUrl: "https://exercise-tracker-page.lovable.app",
      icon: <Utensils className="w-5 h-5" />
    },
    {
      id: "voteverse",
      title: "Voteverse",
      description: language === "en" 
        ? "Mobile platform to create and manage live voting." 
        : "Plataforma móvil para crear votaciones y gestionarlas en vivo.",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      websiteUrl: "https://voteverse-helper.lovable.app/",
      icon: <Vote className="w-5 h-5" />
    }
  ];

  return (
    <main className="relative min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-club-brown text-center mb-12">
          {pageTitle}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-club-orange text-white p-2 rounded-bl-lg">
                  {project.icon}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-2xl text-club-brown mb-2">{project.title}</h3>
                <p className="text-club-brown/80 mb-4">{project.description}</p>
                
                <a 
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-club-orange text-white px-4 py-2 rounded-full transition-all hover:bg-club-terracotta btn-hover-effect"
                >
                  {viewProjectText}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Projects;
