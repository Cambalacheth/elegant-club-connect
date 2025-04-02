
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserLevel, getLevelInfo } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export const useForumUser = () => {
  const [user, setUser] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<UserLevel>(1);
  const [userExperience, setUserExperience] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserLevel(1);
          setUserExperience(0);
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("level_numeric, experience")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        setUserLevel(1);
        setUserExperience(0);
        toast({
          title: "Error",
          description: "No se pudo cargar tu perfil de usuario",
          variant: "destructive",
        });
        return;
      }

      // Handle the number to UserLevel conversion safely
      const numericLevel = data?.level_numeric !== undefined ? 
        Number(data.level_numeric) : 1;
      
      // Ensure the level is valid
      const safeLevel = (numericLevel >= 1 && numericLevel <= 13) ? 
        numericLevel as UserLevel : 1;
      
      setUserLevel(safeLevel);
      setUserExperience(Number(data?.experience || 0));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserLevel(1);
      setUserExperience(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the level information based on user's experience
  const levelInfo = getLevelInfo(userExperience);

  return { 
    user, 
    userLevel, 
    userExperience,
    levelInfo,
    isLoading 
  };
};
