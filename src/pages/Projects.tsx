
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/projects/ProjectCard';
import { Project, ProjectWithProfile } from '../types/project';
import SearchBar from '../components/SearchBar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectForm from '../components/projects/ProjectForm';
import { useForumUser } from '@/hooks/useForumUser';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user } = useForumUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [projectImage, setProjectImage] = useState<File | null>(null);

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
        })) as ProjectWithProfile[] || [];
        
        // Randomize the order of projects using Fisher-Yates shuffle algorithm
        for (let i = transformedProjects.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [transformedProjects[i], transformedProjects[j]] = [transformedProjects[j], transformedProjects[i]];
        }
        
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

  const handleImageChange = (file: File | null) => {
    setProjectImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (values: any) => {
    setIsUploading(true);
    try {
      // Project submission logic would go here
      toast({
        title: "Éxito",
        description: "Proyecto enviado para aprobación",
      });
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setImagePreview(null);
    setProjectImage(null);
  };

  return (
    <div className="min-h-screen bg-club-beige-light">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-club-brown">Proyectos</h1>
            {user && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-club-orange hover:bg-club-terracotta text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Nuevo proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <ProjectForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    language="es"
                    isUploading={isUploading}
                    projectToEdit={null}
                    imagePreview={imagePreview}
                    existingImageUrl={null}
                    onImageChange={handleImageChange}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {/* Search Bar - Optimized for mobile */}
          <div className="mb-6 max-w-full sm:max-w-md mx-auto">
            <SearchBar 
              placeholder="Buscar proyectos..." 
              onSearch={handleSearch}
            />
          </div>
          
          {/* Category Filter - Scrollable on mobile */}
          <div className="mb-8 md:mb-10">
            <h2 className="text-lg md:text-xl font-medium text-club-brown mb-3 md:mb-4">Filtrar por categoría:</h2>
            <div className="flex overflow-x-auto pb-2 md:flex-wrap gap-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-colors whitespace-nowrap ${
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
          
          {/* Projects Grid - Adjusted for mobile */}
          {loading ? (
            <div className="flex justify-center my-8 md:my-12">
              <div className="animate-pulse text-club-brown">Cargando proyectos...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-club-brown text-base md:text-lg">
                {searchQuery 
                  ? 'No hay proyectos que coincidan con tu búsqueda.' 
                  : 'No hay proyectos en esta categoría por el momento.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
