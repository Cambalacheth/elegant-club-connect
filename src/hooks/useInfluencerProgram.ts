
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useInfluencerProgram = (userId: string | undefined) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkInteraction = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if the user has already registered interest in the influencer program
        const { data: interestData, error: interestError } = await supabase
          .from('influencer_program_interests')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (interestError) throw interestError;
        
        if (interestData) {
          setHasInteracted(true);
        } else {
          // As a fallback, also check the XP history for legacy entries
          const { data: xpData, error: xpError } = await supabase
            .from('user_xp_history')
            .select('id')
            .eq('user_id', userId)
            .eq('description', 'Programa de Influencers')
            .maybeSingle();

          if (xpError) throw xpError;
          setHasInteracted(!!xpData);
        }
      } catch (error) {
        console.error('Error checking influencer interaction:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInteraction();
  }, [userId]);

  const registerInterest = async () => {
    if (!userId) {
      toast({
        title: 'Necesitas iniciar sesión',
        description: 'Regístrate o inicia sesión para participar en el programa de influencers',
        variant: 'destructive',
      });
      return false;
    }

    if (hasInteracted) {
      toast({
        title: 'Ya estás participando',
        description: 'Ya has mostrado interés en el programa de influencers',
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Insert record into the influencer_program_interests table
      const { error: insertError } = await supabase
        .from('influencer_program_interests')
        .insert({ user_id: userId });

      if (insertError) throw insertError;

      // Also call the function to add XP to maintain compatibility with existing system
      const { data, error } = await supabase.rpc(
        'add_user_xp',
        { 
          _user_id: userId, 
          _action_name: 'influencer_program_interest',
          _custom_description: 'Programa de Influencers' 
        }
      );

      if (error) throw error;

      setHasInteracted(true);
      toast({
        title: '¡Genial!',
        description: 'Has ganado 100 puntos de experiencia por mostrar interés en el programa de influencers',
      });
      return true;
    } catch (error) {
      console.error('Error registering influencer interest:', error);
      toast({
        title: 'Error',
        description: 'No se pudo procesar tu interés. Inténtalo de nuevo más tarde.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    hasInteracted,
    isLoading,
    registerInterest
  };
};
