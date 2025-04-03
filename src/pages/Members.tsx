
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MemberCard from '@/components/MemberCard';
import Navbar from '@/components/Navbar';
import { Helmet } from 'react-helmet-async';
import { useUser } from '@/hooks/useUser';
import { canAdminContent } from '@/types/user';

const Members = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const { userLevel } = useUser();
  
  // Check if user is admin
  const isAdmin = canAdminContent(userLevel);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      setCurrentLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, level, category, categories')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching members:', error);
        setLoading(false);
        return;
      }
      
      // Process members data
      const processedMembers = data.map(member => {
        let category = member.category || 'General';
        
        // If member has categories array, use the first one
        if (member.categories && member.categories.length > 0) {
          category = member.categories[0];
        }
        
        return {
          ...member,
          category
        };
      });
      
      setMembers(processedMembers);
      setLoading(false);
    };
    
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-club-beige">
      <Helmet>
        <title>{currentLanguage === "en" ? "Members - Terreta Club" : "Miembros - Terreta Club"}</title>
        <meta name="description" content={currentLanguage === "en" ? "Meet the members of our community" : "Conoce a los miembros de nuestra comunidad"} />
      </Helmet>
      
      <Navbar currentLanguage={currentLanguage} />
      
      <div className="container mx-auto py-24 px-6">
        <h1 className="text-3xl font-bold text-club-brown mb-2">
          {currentLanguage === "en" ? "Club Members" : "Miembros del Club"}
        </h1>
        <p className="text-club-brown/70 mb-8">
          {currentLanguage === "en" 
            ? "Meet the Terretianas and Terretianos community" 
            : "Conoce a la comunidad de Terretianas y Terretianos"}
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md h-56 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <MemberCard 
                key={member.username} 
                member={member} 
                isAdmin={isAdmin} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
