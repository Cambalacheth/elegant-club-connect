
import { Tabs } from "@/components/ui/tabs";
import Navbar from '../components/Navbar';
import { useSearch } from '@/hooks/useSearch';
import { 
  MembersResults, 
  ProjectsResults, 
  DebatesResults, 
  ResourcesResults 
} from '@/components/search/SearchResults';
import { CategoryTabs } from '@/components/search/CategoryTabs';
import { LoadingState } from '@/components/search/LoadingState';

const SearchPage = () => {
  const { 
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
    counts
  } = useSearch();

  return (
    <main className="min-h-screen bg-club-beige">
      <Navbar currentLanguage={language} />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl md:text-4xl font-serif text-club-brown text-center mb-4">
          {translations.searchResultsText}
        </h1>
        
        {searchQuery && (
          <p className="text-center text-club-brown/70 mb-8">
            {translations.forText} "{searchQuery}"
          </p>
        )}
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <CategoryTabs 
            activeTab={activeTab}
            language={language}
            counts={counts}
          />
          
          {loading ? (
            <LoadingState searchingText={translations.searchingText} />
          ) : (
            <>
              <MembersResults 
                members={members} 
                noResultsText={translations.noResultsText} 
              />
              
              <ProjectsResults 
                projects={projects} 
                noResultsText={translations.noResultsText} 
              />
              
              <DebatesResults 
                debates={debates} 
                language={language}
                noResultsText={translations.noResultsText} 
              />
              
              <ResourcesResults 
                resources={resources} 
                noResultsText={translations.noResultsText} 
              />
            </>
          )}
        </Tabs>
      </div>
    </main>
  );
};

export default SearchPage;
