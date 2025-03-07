
import { User, FileText, Package, Calendar } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  activeTab: string;
  language: string;
  counts: {
    members: number;
    projects: number;
    debates: number;
    resources: number;
  };
}

export const CategoryTabs = ({ activeTab, language, counts }: CategoryTabsProps) => {
  // Text based on selected language
  const membersText = language === 'en' ? 'Members' : 'Miembros';
  const projectsText = language === 'en' ? 'Projects' : 'Proyectos';
  const debatesText = language === 'en' ? 'Debates' : 'Debates';
  const resourcesText = language === 'en' ? 'Resources' : 'Recursos';

  return (
    <div className="flex justify-center mb-8">
      <TabsList className="bg-white/50 p-1 overflow-x-auto scrollbar-hide">
        <TabsTrigger 
          value="members" 
          className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
        >
          <User className="mr-2 h-4 w-4" />
          {membersText} {counts.members > 0 && `(${counts.members})`}
        </TabsTrigger>
        
        <TabsTrigger 
          value="projects" 
          className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
        >
          <Package className="mr-2 h-4 w-4" />
          {projectsText} {counts.projects > 0 && `(${counts.projects})`}
        </TabsTrigger>
        
        <TabsTrigger 
          value="debates" 
          className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
        >
          <FileText className="mr-2 h-4 w-4" />
          {debatesText} {counts.debates > 0 && `(${counts.debates})`}
        </TabsTrigger>
        
        <TabsTrigger 
          value="resources" 
          className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {resourcesText} {counts.resources > 0 && `(${counts.resources})`}
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
