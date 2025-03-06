
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CommentCard from "@/components/forum/CommentCard";
import CommentForm from "@/components/forum/CommentForm";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Clock, ArrowLeft, Tag, AlertCircle, Trash2 } from "lucide-react";
import { Debate, Comment } from "@/types/forum";
import { UserRole, canModerateContent } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const DebateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>("registered");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for demonstration
  const mockDebate: Debate = {
    id: "1",
    title: "¿Cómo podemos mejorar la colaboración entre miembros?",
    content: "Me gustaría saber qué ideas tienen para mejorar la colaboración entre miembros del club con diferentes perfiles profesionales.\n\nCreo que podríamos organizar más eventos temáticos donde profesionales de distintas áreas puedan compartir conocimientos y experiencias. También sería interesante crear un sistema de mentorías internas donde los miembros más experimentados puedan guiar a los que están comenzando.\n\n¿Qué otras ideas se les ocurren para fomentar la colaboración multidisciplinaria?",
    author_id: "1",
    author_username: "ana_garcia",
    author_avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    author_role: "verified",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "General",
    votes_up: 15,
    votes_down: 2,
    comments_count: 3,
  };

  const mockComments: Comment[] = [
    {
      id: "101",
      debate_id: "1",
      content: "Creo que sería buena idea crear grupos de trabajo por proyectos, donde personas de diferentes perfiles puedan aportar su experiencia. Por ejemplo, un proyecto de app móvil necesitaría diseñadores, desarrolladores, especialistas en UX, etc.",
      author_id: "2",
      author_username: "roberto_dev",
      author_avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      author_role: "moderator",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      votes_up: 7,
      votes_down: 0,
    },
    {
      id: "102",
      debate_id: "1",
      content: "También podríamos implementar un sistema de puntos o reconocimientos para quienes participen activamente en colaboraciones multidisciplinarias. Esto incentivaría la participación y el compromiso.",
      author_id: "3",
      author_username: "laura_design",
      author_avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      author_role: "verified",
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      votes_up: 5,
      votes_down: 1,
    },
    {
      id: "103",
      debate_id: "1",
      content: "¿Qué tal si organizamos desayunos o almuerzos informales periódicos donde los miembros puedan conocerse mejor? A veces las mejores colaboraciones surgen de conversaciones casuales.",
      author_id: "4",
      author_username: "carlos_marketing",
      author_avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      author_role: "admin",
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      votes_up: 10,
      votes_down: 0,
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

  // Load debate and comments
  useEffect(() => {
    if (!id) return;

    // In a real app, you would fetch the debate and comments from the database
    // For demonstration purposes, we'll use mock data
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        if (id === "1") {
          setDebate(mockDebate);
          setComments(mockComments);
        } else {
          // For other IDs, just return mock data
          setDebate({
            ...mockDebate,
            id,
            title: `Debate #${id}`,
            content: `Este es el contenido del debate #${id}. En una aplicación real, este contenido vendría de la base de datos.`,
          });
          setComments([]);
        }
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error loading debate:", err);
      setError("No se pudo cargar el debate. Intenta nuevamente más tarde.");
      setIsLoading(false);
    }
  }, [id]);

  // Format date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  // Handle vote on debate (mock implementation)
  const handleDebateVote = (voteType: "up" | "down") => {
    if (!user || !debate) return;

    // In a real app, you would update the vote in the database
    // For demonstration purposes, we'll update the local state
    if (voteType === "up") {
      setDebate({ ...debate, votes_up: debate.votes_up + 1 });
    } else {
      setDebate({ ...debate, votes_down: debate.votes_down + 1 });
    }

    toast({
      title: "Voto registrado",
      description: "Tu voto ha sido registrado con éxito",
    });
  };

  // Handle vote on comment (mock implementation)
  const handleCommentVote = (commentId: string, voteType: "up" | "down") => {
    if (!user) return;

    // In a real app, you would update the vote in the database
    // For demonstration purposes, we'll update the local state
    setComments(comments.map((comment) => {
      if (comment.id === commentId) {
        if (voteType === "up") {
          return { ...comment, votes_up: comment.votes_up + 1 };
        } else {
          return { ...comment, votes_down: comment.votes_down + 1 };
        }
      }
      return comment;
    }));

    toast({
      title: "Voto registrado",
      description: "Tu voto ha sido registrado con éxito",
    });
  };

  // Handle delete debate (mock implementation)
  const handleDeleteDebate = async () => {
    if (!user || !debate || isDeleting) return;

    if (!canModerateContent(userRole)) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para eliminar debates",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      // In a real app, you would delete the debate from the database
      // For demonstration purposes, we'll just navigate back
      
      toast({
        title: "Debate eliminado",
        description: "El debate ha sido eliminado con éxito",
      });
      
      navigate("/forum");
    } catch (error) {
      console.error("Error deleting debate:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el debate",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete comment (mock implementation)
  const handleDeleteComment = (commentId: string) => {
    if (!user) return;

    if (!canModerateContent(userRole)) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para eliminar comentarios",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would delete the comment from the database
    // For demonstration purposes, we'll update the local state
    setComments(comments.filter((comment) => comment.id !== commentId));

    toast({
      title: "Comentario eliminado",
      description: "El comentario ha sido eliminado con éxito",
    });
  };

  // Handle create comment (mock implementation)
  const handleCreateComment = async (debateId: string, content: string) => {
    if (!user || !debate) return;

    // In a real app, you would create the comment in the database
    // For demonstration purposes, we'll update the local state
    const newComment: Comment = {
      id: `comment-${Date.now()}`, // mock id
      debate_id: debateId,
      content,
      author_id: user.id,
      author_username: user.email.split('@')[0], // simplified for demo
      author_avatar: null,
      author_role: userRole,
      created_at: new Date().toISOString(),
      votes_up: 0,
      votes_down: 0,
    };

    setComments([...comments, newComment]);
    setDebate({ ...debate, comments_count: debate.comments_count + 1 });
  };

  // Render role badge
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "verified":
        return <span className="bg-club-orange/20 text-club-orange text-xs px-2 py-0.5 rounded-full ml-2">Verificado</span>;
      case "moderator":
        return <span className="bg-club-green/20 text-club-green text-xs px-2 py-0.5 rounded-full ml-2">Moderador</span>;
      case "admin":
        return <span className="bg-club-brown/20 text-club-brown text-xs px-2 py-0.5 rounded-full ml-2">Admin</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <Link to="/forum" className="inline-flex items-center text-club-brown hover:text-club-terracotta transition-colors">
            <ArrowLeft size={18} className="mr-1" />
            Volver al foro
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Cargando debate...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        ) : debate ? (
          <div>
            {/* Debate card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-club-brown">{debate.title}</h1>
                  
                  {canModerateContent(userRole) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteDebate}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} className="mr-1" />
                      Eliminar
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Clock size={16} className="mr-1" />
                  <span>{formatDate(debate.created_at)}</span>
                  <span className="mx-2">•</span>
                  <Tag size={16} className="mr-1" />
                  <span>{debate.category}</span>
                </div>
                
                <div className="prose max-w-none mb-6">
                  {debate.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={debate.author_avatar || "/placeholder.svg"} 
                      alt={debate.author_username} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">{debate.author_username}</span>
                        {renderRoleBadge(debate.author_role)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleDebateVote("up")}
                        className="text-gray-500 hover:text-club-green transition-colors"
                        aria-label="Votar positivamente"
                      >
                        <ThumbsUp size={18} />
                      </button>
                      <span className="text-sm">{debate.votes_up}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleDebateVote("down")}
                        className="text-gray-500 hover:text-club-terracotta transition-colors"
                        aria-label="Votar negativamente"
                      >
                        <ThumbsDown size={18} />
                      </button>
                      <span className="text-sm">{debate.votes_down}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comment form */}
            <CommentForm
              debateId={debate.id}
              userRole={userRole}
              userId={user?.id}
              onSubmit={handleCreateComment}
            />
            
            {/* Comments section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-club-brown mb-4">
                Comentarios ({comments.length})
              </h2>
              
              {comments.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-500">No hay comentarios aún. Sé el primero en comentar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      userRole={userRole}
                      userId={user?.id}
                      onVote={handleCommentVote}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontró el debate solicitado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateDetailPage;
