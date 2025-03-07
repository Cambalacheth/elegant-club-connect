
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MemberCard from '../components/MemberCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the profile type
interface Profile {
  id: string;
  username: string;
  level: string;
  category: string;
  avatar_url: string | null;
}

const Members = () => {
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  
  const categories = [
    'all',
    'Legal',
    'Tecnología',
    'Finanzas',
    'Salud',
    'Audiovisual',
    'Eventos'
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch all profiles
        let query = supabase
          .from('profiles')
          .select('id, username, level, category, avatar_url');
        
        // Apply category filter if not "all"
        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Randomize the order of members using Fisher-Yates shuffle algorithm
        const shuffledMembers = data ? [...data] : [];
        for (let i = shuffledMembers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledMembers[i], shuffledMembers[j]] = [shuffledMembers[j], shuffledMembers[i]];
        }
        
        setMembers(shuffledMembers);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast({
          title: 'Error',
          description: 'No pudimos cargar los miembros. Por favor, intenta nuevamente más tarde.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [selectedCategory, toast]);

  return (
    <div className="min-h-screen bg-club-beige-light flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-club-brown mb-6 md:mb-8 text-center">Miembros</h1>
          
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
          
          {/* Members Grid - Adjusted for mobile */}
          {loading ? (
            <div className="flex justify-center my-8 md:my-12">
              <div className="animate-pulse text-club-brown">Cargando miembros...</div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-club-brown text-base md:text-lg">
                No hay miembros en esta categoría por el momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Members;
