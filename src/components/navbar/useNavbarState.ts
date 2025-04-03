
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, levelToRole, UserLevel } from "@/types/user";

export const useNavbarState = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>("registered");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("level_numeric")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user level:", error);
        setUserRole("registered");
        return;
      }

      // Convert numeric level to role using the levelToRole helper
      const numericLevel = data?.level_numeric || 1;
      // Ensure the level is safely cast to UserLevel
      const safeLevel = numericLevel as UserLevel;
      const derivedRole = levelToRole(safeLevel);
      setUserRole(derivedRole);
      
      console.log("User level:", numericLevel, "User role:", derivedRole);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("registered");
    }
  };

  const handleAuthOrProfile = () => {
    if (user) {
      navigate('/user/me');
    } else {
      navigate('/auth');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return {
    isScrolled,
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    user,
    userRole,
    handleAuthOrProfile
  };
};
