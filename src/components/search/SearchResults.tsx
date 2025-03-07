
import { TabsContent } from "@/components/ui/tabs";
import MemberCard from '../MemberCard';
import { NoResults } from './NoResults';
import { ProjectResultItem, DebateResultItem } from './SearchResultItem';
import { Profile, Project, Debate, Content } from './types';

interface MembersResultsProps {
  members: Profile[];
  noResultsText: string;
}

interface ProjectsResultsProps {
  projects: Project[];
  noResultsText: string;
}

interface DebatesResultsProps {
  debates: Debate[];
  language: string;
  noResultsText: string;
}

interface ResourcesResultsProps {
  resources: Content[];
  noResultsText: string;
}

export const MembersResults = ({ members, noResultsText }: MembersResultsProps) => {
  return (
    <TabsContent value="members" className="mt-6">
      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <NoResults noResultsText={noResultsText} />
      )}
    </TabsContent>
  );
};

export const ProjectsResults = ({ projects, noResultsText }: ProjectsResultsProps) => {
  return (
    <TabsContent value="projects" className="mt-6">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectResultItem key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <NoResults noResultsText={noResultsText} />
      )}
    </TabsContent>
  );
};

export const DebatesResults = ({ debates, language, noResultsText }: DebatesResultsProps) => {
  return (
    <TabsContent value="debates" className="mt-6">
      {debates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {debates.map(debate => (
            <DebateResultItem key={debate.id} debate={debate} language={language} />
          ))}
        </div>
      ) : (
        <NoResults noResultsText={noResultsText} />
      )}
    </TabsContent>
  );
};

export const ResourcesResults = ({ resources, noResultsText }: ResourcesResultsProps) => {
  return (
    <TabsContent value="resources" className="mt-6">
      <NoResults noResultsText={noResultsText} />
    </TabsContent>
  );
};
