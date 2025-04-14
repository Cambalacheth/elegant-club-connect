
import { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { useForumUser } from '@/hooks/useForumUser';
import { useProjects } from '@/hooks/useProjects';
import ProjectCategories from '@/components/projects/ProjectCategories';
import ProjectsGrid from '@/components/projects/ProjectsGrid';
import NewProjectButton from '@/components/projects/NewProjectButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryTranslation } from '@/utils/translations';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useForumUser();
  const { projects, loading } = useProjects(selectedCategory, searchQuery);
  const { currentLanguage } = useLanguage();

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

  // Translations
  const projectsTitle = currentLanguage === "en" ? "Projects" : "Proyectos";
  const searchPlaceholder = currentLanguage === "en" ? "Search projects..." : "Buscar proyectos...";

  return (
    <div className="min-h-screen bg-club-beige-light">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-club-brown">{projectsTitle}</h1>
            {user && <NewProjectButton user={user} language={currentLanguage} />}
          </div>
          
          {/* Search Bar - Optimized for mobile */}
          <div className="mb-6 max-w-full sm:max-w-md mx-auto">
            <SearchBar 
              placeholder={searchPlaceholder} 
              onSearch={handleSearch}
            />
          </div>
          
          {/* Category Filter */}
          <ProjectCategories 
            categories={categories.map(cat => ({
              original: cat,
              translated: cat === 'all' 
                ? (currentLanguage === "en" ? "All" : "Todos") 
                : getCategoryTranslation(cat, currentLanguage)
            }))}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            currentLanguage={currentLanguage}
          />
          
          {/* Projects Grid */}
          <ProjectsGrid 
            projects={projects}
            loading={loading}
            searchQuery={searchQuery}
            language={currentLanguage}
          />
        </div>
      </main>
    </div>
  );
};

export default Projects;
