
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import DebateCard from "@/components/forum/DebateCard";
import CreateDebateForm from "@/components/forum/CreateDebateForm";
import CategoryFilter from "@/components/forum/CategoryFilter";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle } from "lucide-react";
import { Debate } from "@/types/forum";
import { UserRole } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

const ForumPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [debates, setDebates] = useState<Debate[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>("registered");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["General", "Legal", "Tecnología", "Finanzas", "Salud", "Audiovisual", "Eventos"];

  // Mock data for demonstration
  const mockDebates: Debate[] = [
    {
      id: "1",
      title: "¿Cómo podemos mejorar la colaboración entre miembros?",
      content: "Me gustaría saber qué ideas tienen para mejorar la colaboración entre miembros del club con diferentes perfiles profesionales.",
      author_id: "1",
      author_username: "ana_garcia",
      author_avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      author_role: "verified",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: "General",
      votes_up: 15,
      votes_down: 2,
      comments_count: 8,
    },
    {
      id: "2",
      title: "Novedades legales que afectan a startups",
      content: "Quisiera compartir algunas novedades legales recientes que pueden afectar a las startups y emprendedores del club.",
      author_id: "2",
      author_username: "carlos_legal",
      author_avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      author_role: "moderator",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Legal",
      votes_up: 24,
      votes_down: 0,
      comments_count: 12,
    },
    {
      id: "3",
      title: "Próximo evento de networking: ideas y sugerencias",
      content: "Estamos organizando un evento de networking para el próximo mes. ¿Qué temas les gustaría que abordáramos?",
      author_id: "3",
      author_username: "maria_admin",
      author_avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      author_role: "admin",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Eventos",
      votes_up: 32,
      votes_down: 1,
      comments_count: 20,
    },
    {
      id: "4",
      title: "Oportunidades de inversión en tecnología verde",
      content: "Quisiera compartir algunas oportunidades interesantes de inversión en el sector de tecnología verde y sostenibilidad.",
      author_id: "4",
      author_username: "pedro_finanzas",
      author_avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      author_role: "verified",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Finanzas",
      votes_up: 18,
      votes_down: 3,
      comments_count: 7,
    },
    {
      id: "5",
      title: "Nuevas tendencias en desarrollo web para 2023",
      content: "Me gustaría discutir sobre las nuevas tendencias en desarrollo web que están surgiendo este año y cómo podemos aplicarlas.",
      author_id: "5",
      author_username: "laura_tech",
      author_avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      author_role: "verified",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Tecnología",
      votes_up: 27,
      votes_down: 2,
      comments_count: 15,
    },
  ];

  // Get user session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        // In a real app, you would fetch the user role from the database
        // For demonstration purposes, we'll just set a default role
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

  // Mock function to fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      // This is a placeholder - in a real app, fetch the role from your database
      // For now, we'll randomly assign a role for demonstration
      const roles: UserRole[] = ["registered", "verified", "moderator", "admin"];
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      setUserRole(randomRole);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("registered");
    }
  };

  // Load debates
  useEffect(() => {
    // In a real app, you would fetch debates from the database
    // For demonstration purposes, we'll use mock data
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setDebates(mockDebates);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error loading debates:", err);
      setError("No se pudieron cargar los debates. Intenta nuevamente más tarde.");
      setIsLoading(false);
    }
  }, []);

  // Filter debates by category
  const filteredDebates = selectedCategory
    ? debates.filter((debate) => debate.category === selectedCategory)
    : debates;

  // Handle debate creation (mock implementation)
  const handleCreateDebate = async (title: string, content: string, category: string) => {
    if (!user) return;

    // In a real app, you would create the debate in the database
    // For demonstration purposes, we'll add it to the local state
    const newDebate: Debate = {
      id: `${Date.now()}`, // mock id
      title,
      content,
      author_id: user.id,
      author_username: user.email.split('@')[0], // simplified for demo
      author_avatar: null,
      author_role: userRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category,
      votes_up: 0,
      votes_down: 0,
      comments_count: 0,
    };

    setDebates([newDebate, ...debates]);
    setShowCreateForm(false);
  };

  // Handle vote (mock implementation)
  const handleVote = (debateId: string, voteType: "up" | "down") => {
    if (!user) return;

    // In a real app, you would update the vote in the database
    // For demonstration purposes, we'll update the local state
    setDebates(debates.map((debate) => {
      if (debate.id === debateId) {
        if (voteType === "up") {
          return { ...debate, votes_up: debate.votes_up + 1 };
        } else {
          return { ...debate, votes_down: debate.votes_down + 1 };
        }
      }
      return debate;
    }));

    toast({
      title: "Voto registrado",
      description: "Tu voto ha sido registrado con éxito",
    });
  };

  // Handle debate deletion (mock implementation)
  const handleDeleteDebate = (debateId: string) => {
    if (!user) return;

    // In a real app, you would delete the debate from the database
    // For demonstration purposes, we'll update the local state
    setDebates(debates.filter((debate) => debate.id !== debateId));

    toast({
      title: "Debate eliminado",
      description: "El debate ha sido eliminado con éxito",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-club-brown mb-6">Foro de discusión</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full bg-club-orange hover:bg-club-terracotta text-white flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                {showCreateForm ? "Cancelar" : "Crear nuevo debate"}
              </Button>
            </div>
            
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {showCreateForm && (
              <CreateDebateForm
                userRole={userRole}
                userId={user?.id}
                onSubmit={handleCreateDebate}
              />
            )}
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Cargando debates...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="mr-2" size={20} />
                <p>{error}</p>
              </div>
            ) : filteredDebates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay debates en esta categoría.</p>
              </div>
            ) : (
              <div>
                {filteredDebates.map((debate) => (
                  <DebateCard
                    key={debate.id}
                    debate={debate}
                    userRole={userRole}
                    userId={user?.id}
                    onVote={handleVote}
                    onDelete={handleDeleteDebate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
