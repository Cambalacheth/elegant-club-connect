
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Package, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '../components/Navbar';
import MemberCard from '../components/MemberCard';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for different data types
interface Profile {
  id: string;
  username: string;
  level: string;
  category: string;
  avatar_url: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string | null;
}

interface Debate {
  id: string;
  title: string;
  content: string;
  category: string;
  author_username: string;
}

interface Content {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
}

const SearchPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("es");
  const [loading, setLoading] = useState(false);
  
  // Search results for different categories
  const [members, setMembers] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [resources, setResources] = useState<Content[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    // Extract search query from URL
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
    
    // Extract language from URL if present
    const langParam = params.get('lang');
    if (langParam && (langParam === 'es' || langParam === 'en')) {
      setLanguage(langParam);
    }
  }, [location]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      // Search in profiles/members
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('id, username, level, category, avatar_url')
        .or(`username.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(12);
      
      if (membersError) throw membersError;
      setMembers(membersData || []);
      
      // Search in projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, description, category, image_url')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,long_description.ilike.%${query}%`)
        .limit(12);
      
      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      
      // Search in debates
      const { data: debatesData, error: debatesError } = await supabase
        .from('debates_with_authors')
        .select('id, title, content, category, author_username')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(12);
      
      if (debatesError) throw debatesError;
      setDebates(debatesData || []);
      
      // En el futuro, cuando se implemente la tabla de recursos, aquí iría la búsqueda en recursos
      // Por ahora dejamos un array vacío
      setResources([]);
      
    } catch (error) {
      console.error('Error performing search:', error);
      toast({
        title: language === 'en' ? 'Search Error' : 'Error de búsqueda',
        description: language === 'en' 
          ? 'An error occurred while searching. Please try again.' 
          : 'Ocurrió un error durante la búsqueda. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Text based on selected language
  const membersText = language === 'en' ? 'Members' : 'Miembros';
  const projectsText = language === 'en' ? 'Projects' : 'Proyectos';
  const debatesText = language === 'en' ? 'Debates' : 'Debates';
  const resourcesText = language === 'en' ? 'Resources' : 'Recursos';
  const searchResultsText = language === 'en' ? 'Search Results' : 'Resultados de Búsqueda';
  const noResultsText = language === 'en' ? 'No results found' : 'No se encontraron resultados';
  const searchingText = language === 'en' ? 'Searching...' : 'Buscando...';
  const forText = language === 'en' ? 'for' : 'para';

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl md:text-4xl font-serif text-club-brown text-center mb-4">
          {searchResultsText}
        </h1>
        
        {searchQuery && (
          <p className="text-center text-club-brown/70 mb-8">
            {forText} "{searchQuery}"
          </p>
        )}
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white/50 p-1 overflow-x-auto scrollbar-hide">
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <User className="mr-2 h-4 w-4" />
                {membersText} {members.length > 0 && `(${members.length})`}
              </TabsTrigger>
              
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Package className="mr-2 h-4 w-4" />
                {projectsText} {projects.length > 0 && `(${projects.length})`}
              </TabsTrigger>
              
              <TabsTrigger 
                value="debates" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                {debatesText} {debates.length > 0 && `(${debates.length})`}
              </TabsTrigger>
              
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-club-orange data-[state=active]:text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {resourcesText} {resources.length > 0 && `(${resources.length})`}
              </TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <div className="flex justify-center my-8 md:my-12">
              <div className="animate-pulse text-club-brown">{searchingText}</div>
            </div>
          ) : (
            <>
              <TabsContent value="members" className="mt-6">
                {members.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {members.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-club-brown">{noResultsText}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="projects" className="mt-6">
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map(project => (
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-club-brown">{noResultsText}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="debates" className="mt-6">
                {debates.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {debates.map(debate => (
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-club-brown">{noResultsText}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resources" className="mt-6">
                <div className="text-center py-8">
                  <p className="text-club-brown">{noResultsText}</p>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  );
};

export default SearchPage;
