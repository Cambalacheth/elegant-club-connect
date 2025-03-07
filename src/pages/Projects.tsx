
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/projects/ProjectCard';
import { Project } from '../types/project';
import SearchBar from '../components/SearchBar';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const categories = [
    'all',
    'Legal',
    'Tecnología',
    'Finanzas',
    'Audiovisual',
    'Salud',
    'Comunidad',
    'Eventos'
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Fetch projects with profile information
        let query = supabase
          .from('projects')
          .select(`
            *,
            profiles:profile_id (
              username,
              avatar_url
            )
          `);
        
        // Apply category filter if not "all"
        if (selectedCategory !== 'all') {
          // Try to match either the primary category or look in the categories array
          query = query.or(`category.eq.${selectedCategory},categories.cs.{${selectedCategory}}`);
        }
        
        // Apply search query if provided
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Transform the data to include username in the project object
        const transformedProjects = data?.map(project => ({
          ...project,
          username: project.profiles?.username || 'Unknown User',
          avatar_url: project.profiles?.avatar_url || null
        })) || [];
        
        setProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'No pudimos cargar los proyectos. Por favor, intenta nuevamente más tarde.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [selectedCategory, searchQuery, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-club-beige-light">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-club-brown mb-8 text-center">Proyectos</h1>
          
          {/* Search Bar */}
          <div className="mb-6 max-w-md mx-auto">
            <SearchBar 
              placeholder="Buscar proyectos..." 
              onSearch={handleSearch}
            />
          </div>
          
          {/* Category Filter */}
          <div className="mb-10">
            <h2 className="text-xl font-medium text-club-brown mb-4">Filtrar por categoría:</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-club-orange text-white'
                      : 'bg-white border border-club-olive text-club-brown hover:bg-club-beige-dark'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-pulse text-club-brown">Cargando proyectos...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-club-brown text-lg">
                {searchQuery 
                  ? 'No hay proyectos que coincidan con tu búsqueda.' 
                  : 'No hay proyectos en esta categoría por el momento.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewText="Ver proyecto" 
                  onDelete={() => {}} 
                  language="es"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
