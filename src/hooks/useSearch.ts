
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile, Project, Debate, Content } from '@/components/search/types';

export const useSearch = () => {
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
      
      // In the future, when the resources table is implemented, search would go here
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

  // Text translations based on selected language
  const translations = {
    membersText: language === 'en' ? 'Members' : 'Miembros',
    projectsText: language === 'en' ? 'Projects' : 'Proyectos',
    debatesText: language === 'en' ? 'Debates' : 'Debates',
    resourcesText: language === 'en' ? 'Resources' : 'Recursos',
    searchResultsText: language === 'en' ? 'Search Results' : 'Resultados de Búsqueda',
    noResultsText: language === 'en' ? 'No results found' : 'No se encontraron resultados',
    searchingText: language === 'en' ? 'Searching...' : 'Buscando...',
    forText: language === 'en' ? 'for' : 'para',
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    language,
    loading,
    members,
    projects,
    debates,
    resources,
    translations,
    counts: {
      members: members.length,
      projects: projects.length,
      debates: debates.length,
      resources: resources.length,
    }
  };
};
