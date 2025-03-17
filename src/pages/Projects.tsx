
import { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { useForumUser } from '@/hooks/useForumUser';
import { useProjects } from '@/hooks/useProjects';
import ProjectCategories from '@/components/projects/ProjectCategories';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import NewProjectButton from '@/components/projects/NewProjectButton';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useForumUser();
  const { projects, loading } = useProjects(selectedCategory, searchQuery);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-club-beige-light">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-club-brown">Proyectos</h1>
            {user && <NewProjectButton user={user} language="es" />}
          </div>
          
          {/* Search Bar - Optimized for mobile */}
          <div className="mb-6 max-w-full sm:max-w-md mx-auto">
            <SearchBar 
              placeholder="Buscar proyectos..." 
              onSearch={handleSearch}
            />
          </div>
          
          {/* Category Filter */}
          <ProjectCategories 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          {/* Projects Grid */}
          <ProjectsGrid 
            projects={projects}
            loading={loading}
            searchQuery={searchQuery}
            language="es"
          />
        </div>
      </main>
    </div>
  );
};

export default Projects;
