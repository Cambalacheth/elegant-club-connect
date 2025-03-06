
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import ProjectSubmitModal from "@/components/projects/ProjectSubmitModal";
import { useForumUser } from "@/hooks/useForumUser";
import { useToast } from "@/hooks/use-toast";
import ProjectCard from "@/components/projects/ProjectCard";

interface ProjectWithProfile {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  image_url?: string;
  website_url?: string;
  category: string;
  tags?: string[];
  profile_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

const Projects = () => {
  const location = useLocation();
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { user } = useForumUser();
  const { toast } = useToast();

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
  const submitProjectText = language === "en" ? "Submit Project" : "Enviar Proyecto";
  const noProjectsText = language === "en" 
    ? "No projects yet. Be the first to submit one!" 
    : "Aún no hay proyectos. ¡Sé el primero en enviar uno!";
  const loginToSubmitText = language === "en"
    ? "Login to submit your project"
    : "Inicia sesión para enviar tu proyecto";

  // Fetch projects from Supabase
  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, 
          name, 
          description, 
          long_description,
          image_url, 
          website_url, 
          category,
          tags,
          profile_id,
          created_at,
          profiles:profile_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }
      
      return data?.map(project => ({
        ...project,
        username: project.profiles?.username || 'Unknown',
        avatar_url: project.profiles?.avatar_url
      })) as ProjectWithProfile[];
    }
  });

  const handleProjectSubmitted = () => {
    setShowSubmitModal(false);
    refetch();
    toast({
      title: language === "en" ? "Project submitted" : "Proyecto enviado",
      description: language === "en" 
        ? "Your project has been submitted successfully." 
        : "Tu proyecto ha sido enviado exitosamente.",
    });
  };

  return (
    <main className="relative min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-club-brown text-center md:text-left mb-6 md:mb-0">
            {pageTitle}
          </h1>
          
          {user ? (
            <Button 
              onClick={() => setShowSubmitModal(true)}
              className="bg-club-orange text-white hover:bg-club-terracotta"
            >
              <Plus className="w-4 h-4 mr-2" /> {submitProjectText}
            </Button>
          ) : (
            <p className="text-club-brown/80 italic">{loginToSubmitText}</p>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                viewText={language === "en" ? "View Project" : "Ver Proyecto"}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-club-brown text-xl">{noProjectsText}</p>
          </div>
        )}
      </div>
      
      {showSubmitModal && (
        <ProjectSubmitModal 
          onClose={() => setShowSubmitModal(false)} 
          onSubmitted={handleProjectSubmitted}
          language={language}
        />
      )}
      
      <Footer />
    </main>
  );
};

export default Projects;
