
import { useState, useEffect } from "react";
import { Menu, X, User, CheckCircle, ShieldAlert, ShieldCheck, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, canAdminContent } from "@/types/user";
import SearchBar from "./SearchBar";

interface NavbarProps {
  currentLanguage?: string;
}

const Navbar = ({ currentLanguage = "es" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>("registered");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
        .select("level")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole("registered");
        return;
      }

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
    }
  };

  const handleAuthOrProfile = () => {
    if (user) {
      navigate('/user/me');
    } else {
      navigate('/auth');
    }
  };

  const renderRoleIcon = () => {
    if (!user) return null;
    
    switch (userRole) {
      case "verified":
        return <CheckCircle size={16} className="text-club-orange" />;
      case "moderator":
        return <ShieldAlert size={16} className="text-club-orange" />;
      case "admin":
        return <ShieldCheck size={16} className="text-club-orange" />;
      default:
        return null;
    }
  };

  const projectsText = currentLanguage === "en" ? "Projects" : "Proyectos";
  const membersText = currentLanguage === "en" ? "Members" : "Miembros";
  const forumText = currentLanguage === "en" ? "Forum" : "Foro";
  const contentText = currentLanguage === "en" ? "Content" : "Contenido";
  const eventsText = currentLanguage === "en" ? "Events" : "Eventos";
  const enterClubText = currentLanguage === "en" 
    ? (user ? "My Profile" : "Enter the Club") 
    : (user ? "Mi Perfil" : "Ingresar al Club");
  const adminText = currentLanguage === "en" ? "Admin" : "Administración";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-club-beige/90 backdrop-blur-md shadow-md" : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center">
            <span className="font-serif text-2xl font-semibold text-club-brown">
              Terreta Hub
            </span>
          </Link>
          <div className="hidden md:block">
            <SearchBar currentLanguage={currentLanguage} />
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/projects"
            className="text-club-brown hover:text-club-terracotta transition-colors duration-300"
          >
            {projectsText}
          </Link>
          <Link 
            to="/content"
            className="text-club-brown hover:text-club-terracotta transition-colors duration-300"
          >
            {contentText}
          </Link>
          <Link 
            to="/events"
            className="text-club-brown hover:text-club-terracotta transition-colors duration-300"
          >
            {eventsText}
          </Link>
          <Link 
            to="/members"
            className="text-club-brown hover:text-club-terracotta transition-colors duration-300"
          >
            {membersText}
          </Link>
          <Link 
            to="/forum"
            className="text-club-brown hover:text-club-terracotta transition-colors duration-300"
          >
            {forumText}
          </Link>
          {canAdminContent(userRole) && (
            <Link 
              to="/admin"
              className="text-club-brown hover:text-club-terracotta transition-colors duration-300 flex items-center gap-1"
            >
              <Settings size={16} />
              {adminText}
            </Link>
          )}
          <button 
            onClick={handleAuthOrProfile}
            className="bg-club-orange text-club-white px-6 py-2.5 rounded-full btn-hover-effect flex items-center gap-2"
          >
            {enterClubText}
            <div className="flex items-center gap-1">
              {user && <User size={16} />}
              {renderRoleIcon()}
            </div>
          </button>
        </nav>

        <div className="flex items-center md:hidden">
          <div className="mr-4">
            <SearchBar currentLanguage={currentLanguage} />
          </div>
          <button 
            className="text-club-brown"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-club-beige/95 backdrop-blur-md shadow-lg py-4 animate-fade-in">
          <nav className="flex flex-col space-y-4 px-6">
            <Link 
              to="/projects"
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {projectsText}
            </Link>
            <Link 
              to="/content"
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {contentText}
            </Link>
            <Link 
              to="/events"
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {eventsText}
            </Link>
            <Link 
              to="/members"
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {membersText}
            </Link>
            <Link 
              to="/forum"
              className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {forumText}
            </Link>
            {canAdminContent(userRole) && (
              <Link 
                to="/admin"
                className="text-club-brown hover:text-club-terracotta py-2 transition-colors duration-300 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={16} />
                {adminText}
              </Link>
            )}
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                handleAuthOrProfile();
              }}
              className="bg-club-orange text-club-white px-6 py-2.5 rounded-full inline-block text-center btn-hover-effect flex items-center gap-2 justify-center"
            >
              {enterClubText}
              <div className="flex items-center gap-1">
                {user && <User size={16} />}
                {renderRoleIcon()}
              </div>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
