
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface ProjectCardProps {
  project: ProjectWithProfile;
  viewText: string;
}

const ProjectCard = ({ project, viewText }: ProjectCardProps) => {
  // Get category icon and color
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Legal':
        return 'scale';
      case 'Tecnología':
        return 'code';
      case 'Finanzas':
        return 'landmark';
      case 'Audiovisual':
        return 'camera';
      case 'Comunidad':
        return 'users';
      case 'Salud':
        return 'heart-pulse';
      default:
        return 'layers';
    }
  };

  return (
    <div 
      key={project.id}
      className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-0 right-0 bg-club-orange text-white p-2 rounded-bl-lg">
          <i className={`lucide-${getCategoryIcon(project.category)}`}></i>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-serif text-2xl text-club-brown mb-2">{project.name}</h3>
          <Badge variant="outline" className="bg-club-beige/50 text-club-brown border-none">
            {project.category}
          </Badge>
        </div>
        
        <p className="text-club-brown/80 mb-4">{project.description}</p>
        
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-club-beige/30 text-club-brown/70">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.avatar_url || ''} alt={project.username} />
              <AvatarFallback>{project.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-club-brown/70">{project.username}</span>
          </div>
          
          {project.website_url && (
            <a 
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-club-orange text-white px-4 py-2 rounded-full transition-all hover:bg-club-terracotta"
            >
              {viewText}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
