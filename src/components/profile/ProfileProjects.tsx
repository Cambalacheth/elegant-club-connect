
import { ExternalLink } from "lucide-react";
import { Project } from "@/types/project";

interface ProfileProjectsProps {
  projects: Project[];
  currentLanguage: string;
  getCategoryTranslation: (category: string) => string;
}

const ProfileProjects = ({ projects, currentLanguage, getCategoryTranslation }: ProfileProjectsProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-club-brown mb-4">
        {currentLanguage === "en" ? "Projects" : "Proyectos"}
      </h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-club-beige/40 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-club-brown">{project.name}</h3>
              {project.website_url && (
                <a 
                  href={project.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-club-orange hover:text-club-terracota transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
            {project.description && (
              <p className="text-club-brown/90 mt-2">{project.description}</p>
            )}
            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="bg-club-beige px-2 py-1 rounded text-xs text-club-brown"
                  >
                    {getCategoryTranslation(category)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileProjects;
