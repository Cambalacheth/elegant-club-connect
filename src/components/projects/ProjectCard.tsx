
import { Link } from "react-router-dom";
import { Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  image_url?: string;
  website_url?: string;
  category: string;
  categories?: string[]; // Add support for multiple categories
  tags?: string[];
  profile_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  viewText: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Legal":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
    case "Tecnología":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
    case "Finanzas":
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
    case "Audiovisual":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    case "Comunidad":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
    case "Salud":
      return "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
  }
};

const ProjectCard = ({ project, viewText }: ProjectCardProps) => {
  const formattedDate = new Date(project.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Use categories array if available, otherwise use single category
  const categoriesToDisplay = project.categories || [project.category];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Project Image */}
      <div className="h-40 bg-gray-200 relative">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-club-beige/50 flex items-center justify-center">
            <span className="text-club-brown/30 text-xl font-serif">
              {project.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {categoriesToDisplay.map((category, index) => (
            <Badge
              key={index}
              variant="outline"
              className={getCategoryColor(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <h3 className="text-xl font-serif text-club-brown mb-2 line-clamp-2">
          {project.name}
        </h3>

        <p className="text-club-brown/80 mb-4 text-sm line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center text-club-brown/60 text-xs mb-5">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formattedDate}</span>
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to={`/user/${project.username}`} className="flex items-center space-x-2 hover:text-club-terracotta">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.avatar_url || undefined} />
                <AvatarFallback>{project.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{project.username}</span>
            </Link>
          </div>

          {project.website_url ? (
            <a
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-club-orange hover:text-club-terracotta"
            >
              <span className="mr-1">{viewText}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <Button
              variant="link"
              className="text-club-orange p-0 h-auto hover:text-club-terracotta"
              disabled
            >
              {viewText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
