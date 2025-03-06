
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

  // Get user session
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
    }
  };

  // Load debates
  useEffect(() => {
    const fetchDebates = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("debates_with_authors")
          .select("*");

        if (selectedCategory) {
          query = query.eq("category", selectedCategory);
        }

        const { data, error: dbError } = await query.order("created_at", { ascending: false });

        if (dbError) {
          throw dbError;
        }

        setDebates(data as Debate[]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading debates:", err);
        setError("No se pudieron cargar los debates. Intenta nuevamente más tarde.");
        setIsLoading(false);
      }
    };

    fetchDebates();
  }, [selectedCategory]);

  // Handle debate creation
  const handleCreateDebate = async (title: string, content: string, category: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("debates")
        .insert([
          { 
            title, 
            content, 
            category, 
            author_id: user.id 
          }
        ])
        .select();

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear el debate: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch the newly created debate with author info
      const { data: newDebateWithAuthor, error: fetchError } = await supabase
        .from("debates_with_authors")
        .select("*")
        .eq("id", data[0].id)
        .single();

      if (fetchError) {
        console.error("Error fetching new debate:", fetchError);
      } else {
        setDebates([newDebateWithAuthor as Debate, ...debates]);
      }

      setShowCreateForm(false);
      toast({
        title: "Debate creado",
        description: "Tu debate ha sido publicado con éxito",
      });
    } catch (error) {
      console.error("Error creating debate:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el debate",
        variant: "destructive",
      });
    }
  };

  // Handle vote
  const handleVote = async (debateId: string, voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert vote into votes table
      const { error } = await supabase
        .from("votes")
        .insert([
          { 
            user_id: user.id, 
            reference_id: debateId, 
            reference_type: "debate", 
            vote_type: voteType 
          }
        ]);

      if (error) {
        // If the error is because of a unique constraint violation,
        // it means the user already voted
        if (error.code === "23505") {
          toast({
            title: "Voto duplicado",
            description: "Ya has votado en este debate",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "No se pudo registrar el voto: " + error.message,
            variant: "destructive",
          });
        }
        return;
      }

      // Optimistic update of UI
      setDebates(debates.map(debate => {
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
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar el voto",
        variant: "destructive",
      });
    }
  };

  // Handle debate deletion
  const handleDeleteDebate = async (debateId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("debates")
        .delete()
        .eq("id", debateId);

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el debate: " + error.message,
          variant: "destructive",
        });
        return;
      }

      setDebates(debates.filter(debate => debate.id !== debateId));
      toast({
        title: "Debate eliminado",
        description: "El debate ha sido eliminado con éxito",
      });
    } catch (error) {
      console.error("Error deleting debate:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el debate",
        variant: "destructive",
      });
    }
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
            ) : debates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay debates en esta categoría.</p>
              </div>
            ) : (
              <div>
                {debates.map((debate) => (
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
