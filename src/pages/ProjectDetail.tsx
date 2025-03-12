
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("projects")
          .select(`
            *,
            profiles:profile_id (
              username,
              avatar_url
            )
          `)
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        // Transform the data to include username in the project object
        const transformedProject = {
          ...data,
          username: data.profiles?.username || 'Unknown User',
          avatar_url: data.profiles?.avatar_url || null
        };
        
        setProject(transformedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-club-beige flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-orange"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-club-beige">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-serif text-club-brown mb-6">
            {language === "en" ? "Project not found" : "Proyecto no encontrado"}
          </h1>
          <Link to="/projects">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "en" ? "Back to Projects" : "Volver a Proyectos"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoriesToDisplay = project.categories || [project.category];

  return (
    <div className="min-h-screen bg-club-beige-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Link to="/projects" className="inline-flex items-center text-club-brown hover:text-club-orange mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Back to Projects" : "Volver a Proyectos"}
          </Link>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {project.image_url && (
              <div className="w-full h-[300px] overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {categoriesToDisplay.map((category, index) => (
                  <span 
                    key={index} 
                    className="bg-club-beige px-3 py-1 rounded-full text-xs font-medium text-club-brown"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl font-serif text-club-brown mb-6">
                {project.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                  {project.avatar_url ? (
                    <img 
                      src={project.avatar_url} 
                      alt={project.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-club-beige flex items-center justify-center">
                      <span className="text-club-brown font-medium">
                        {project.username?.substring(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-club-brown/80">{project.username}</span>
              </div>
              
              <div className="prose prose-lg max-w-none text-club-brown mb-8">
                {project.long_description ? (
                  <p className="whitespace-pre-line">{project.long_description}</p>
                ) : (
                  <p className="whitespace-pre-line">{project.description}</p>
                )}
              </div>
              
              {project.website_url && (
                <a 
                  href={project.website_url} 
                  className="inline-flex items-center bg-club-orange text-white px-6 py-3 rounded-full hover:bg-club-terracotta transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {language === "en" ? "Visit Project" : "Visitar Proyecto"}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
