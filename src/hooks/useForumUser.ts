
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export const useForumUser = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>("registered");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole("registered");
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user role from Supabase
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole("registered");
        return;
      }

      // Map Supabase level to UserRole
      if (data?.level === "Verificado") {
        setUserRole("verified");
      } else if (data?.level === "Moderador") {
        setUserRole("moderator");
      } else if (data?.level === "Admin") {
        setUserRole("admin");
      } else {
        setUserRole("registered");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("registered");
    } finally {
      setIsLoading(false);
    }
  };

  return { user, userRole, isLoading };
};
