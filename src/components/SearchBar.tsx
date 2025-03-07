
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Package, FileText, FileQuestion } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useClickOutside } from '@/hooks/use-click-outside';

interface SearchBarProps {
  currentLanguage?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'member' | 'project' | 'debate' | 'resource';
  subtitle?: string;
  url: string;
}

const SearchBar = ({ 
  currentLanguage = 'es',
  placeholder,
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(searchRef, () => {
    setShowResults(false);
  });

  const defaultPlaceholder = currentLanguage === 'en' 
    ? 'Search...' 
    : 'Buscar...';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      setShowResults(true);

      try {
        // Search for members
        const { data: members } = await supabase
          .from('profiles')
          .select('id, username, level, category')
          .or(`username.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(3);

        // Search for projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id, name, description, category')
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(3);

        // Search for debates
        const { data: debates } = await supabase
          .from('debates_with_authors')
          .select('id, title, content, author_username')
          .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
          .limit(3);

        // In the future, we'll add resources here
        // For now, we'll mock an empty array
        const resources: any[] = [];

        // Format results
        const formattedResults: SearchResult[] = [
          ...(members || []).map((member): SearchResult => ({
            id: member.id,
            title: member.username,
            subtitle: member.category,
            type: 'member',
            url: `/user/${member.username}`
          })),
          ...(projects || []).map((project): SearchResult => ({
            id: project.id,
            title: project.name,
            subtitle: project.category,
            type: 'project',
            url: `/projects#${project.id}`
          })),
          ...(debates || []).map((debate): SearchResult => ({
            id: debate.id,
            title: debate.title,
            subtitle: debate.author_username,
            type: 'debate',
            url: `/forum/${debate.id}`
          })),
          ...(resources || []).map((resource): SearchResult => ({
            id: resource.id,
            title: resource.title,
            subtitle: resource.type,
            type: 'resource',
            url: `/content#${resource.id}`
          }))
        ];

        setResults(formattedResults.slice(0, 8)); // Limit to 8 total results
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search requests
    const debounceTimer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Navigate to search page with query parameter
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleResultClick = (url: string) => {
    setShowResults(false);
    setIsExpanded(false);
    navigate(url);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'member':
        return <User size={14} className="text-club-brown/70" />;
      case 'project':
        return <Package size={14} className="text-club-brown/70" />;
      case 'debate':
        return <FileText size={14} className="text-club-brown/70" />;
      case 'resource':
        return <FileQuestion size={14} className="text-club-brown/70" />;
      default:
        return <Search size={14} className="text-club-brown/70" />;
    }
  };

  const getTypeName = (type: string) => {
    if (currentLanguage === 'en') {
      return type.charAt(0).toUpperCase() + type.slice(1);
    } else {
      switch (type) {
        case 'member':
          return 'Miembro';
        case 'project':
          return 'Proyecto';
        case 'debate':
          return 'Debate';
        case 'resource':
          return 'Recurso';
        default:
          return 'Resultado';
      }
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex items-center">
        {isExpanded ? (
          <>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={placeholder || defaultPlaceholder}
              className="w-full md:w-64 text-sm rounded-full pl-10 pr-10 py-2 bg-white/80 focus:bg-white focus:border-club-orange transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={toggleSearch}
              className="absolute left-3 text-club-brown/70"
            >
              <Search size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
              }}
              className="absolute right-3 text-club-brown/70"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleSearch}
            className="flex items-center text-club-brown hover:text-club-terracotta transition-colors"
          >
            <Search size={20} />
            <span className="ml-2 hidden md:inline text-sm">
              {currentLanguage === 'en' ? 'Search' : 'Buscar'}
            </span>
          </button>
        )}
      </form>

      {/* Quick search results */}
      {showResults && isExpanded && searchQuery.length >= 2 && (
        <div className="absolute mt-2 w-full md:w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-club-brown/70">
              {currentLanguage === 'en' ? 'Searching...' : 'Buscando...'}
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  className="w-full text-left px-4 py-2 hover:bg-club-beige/30 transition-colors"
                  onClick={() => handleResultClick(result.url)}
                >
                  <div className="flex items-center">
                    <div className="mr-2">
                      {getIconForType(result.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-club-brown text-sm truncate">
                        {result.title}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-club-brown/70 truncate">
                          {result.subtitle}
                        </p>
                        <span className="text-xs bg-club-beige/50 px-1.5 py-0.5 rounded text-club-brown/80 ml-2 whitespace-nowrap">
                          {getTypeName(result.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-club-beige">
                <button 
                  className="w-full text-center text-sm text-club-orange hover:text-club-terracotta"
                  onClick={handleSubmit}
                >
                  {currentLanguage === 'en' 
                    ? `View all results for "${searchQuery}"`
                    : `Ver todos los resultados para "${searchQuery}"`}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-club-brown/70">
              {currentLanguage === 'en' 
                ? 'No results found' 
                : 'No se encontraron resultados'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
