
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  currentLanguage: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ currentLanguage, placeholder, onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setSearchQuery('');
    }
  };

  const defaultPlaceholder = currentLanguage === 'en' 
    ? 'Search...' 
    : 'Buscar...';

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        className="bg-white/80 border-0 rounded-full pl-10 pr-4 py-2 text-sm w-40 focus:w-56 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-club-orange/30"
      />
      <button
        type="submit"
        className="absolute left-0 top-0 h-full flex items-center justify-center px-3 text-club-brown/70"
      >
        <Search size={16} />
      </button>
    </form>
  );
};

export default SearchBar;
