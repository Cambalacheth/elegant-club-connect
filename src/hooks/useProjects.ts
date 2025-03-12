
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectWithProfile } from '@/types/project';

export const useProjects = (selectedCategory: string, searchQuery: string) => {
  const [projects, setProjects] = useState<ProjectWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return { projects, loading };
};
