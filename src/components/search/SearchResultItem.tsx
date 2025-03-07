
import { Project, Debate, Profile, Content } from './types';

interface MemberItemProps {
  member: Profile;
}

interface ProjectItemProps {
  project: Project;
}

interface DebateItemProps {
  debate: Debate;
  language: string;
}

// Member search result item
export const MemberResultItem = ({ member }: MemberItemProps) => {
  // We're using the existing MemberCard component, so this is just a passthrough
  return null;
};

// Project search result item
export const ProjectResultItem = ({ project }: ProjectItemProps) => {
  return (
    <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
      {project.image_url && (
        <div className="h-40 overflow-hidden">
          <img 
            src={project.image_url} 
            alt={project.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-medium text-club-brown mb-2">{project.name}</h3>
        <p className="text-club-brown/80 mb-3 line-clamp-2">{project.description}</p>
        <span className="inline-block bg-club-beige px-3 py-1 rounded-full text-xs font-medium text-club-brown">
          {project.category}
        </span>
      </div>
    </div>
  );
};

// Debate search result item
export const DebateResultItem = ({ debate, language }: DebateItemProps) => {
  return (
    <div key={debate.id} className="bg-white rounded-lg shadow-sm p-5">
      <h3 className="text-xl font-medium text-club-brown mb-2">{debate.title}</h3>
      <p className="text-sm text-club-brown/70 mb-2">
        {language === 'en' ? 'By' : 'Por'} {debate.author_username}
      </p>
      <p className="text-club-brown/80 mb-3 line-clamp-3">{debate.content}</p>
      <span className="inline-block bg-club-beige px-3 py-1 rounded-full text-xs font-medium text-club-brown">
        {debate.category}
      </span>
    </div>
  );
};
