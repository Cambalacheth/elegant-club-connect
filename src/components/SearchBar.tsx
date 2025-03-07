
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  currentLanguage?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ 
  currentLanguage = 'es',
  placeholder,
  onSearch 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const defaultPlaceholder = currentLanguage === 'en' 
    ? 'Search...' 
    : 'Buscar...';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        // Default behavior: navigate to search page with query parameter
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
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
                toggleSearch();
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
    </div>
  );
};

export default SearchBar;
