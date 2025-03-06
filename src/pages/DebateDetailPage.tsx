
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

  // Load debate and comments
  useEffect(() => {
    if (!id) return;

    const fetchDebateAndComments = async () => {
      setIsLoading(true);
      try {
        // Fetch debate
        const { data: debateData, error: debateError } = await supabase
          .from("debates_with_authors")
          .select("*")
          .eq("id", id)
          .single();

        if (debateError) {
          throw debateError;
        }

        setDebate(debateData as Debate);

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments_with_authors")
          .select("*")
          .eq("debate_id", id)
          .order("created_at", { ascending: true });

        if (commentsError) {
          throw commentsError;
        }

        setComments(commentsData as Comment[]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading debate:", err);
        setError("No se pudo cargar el debate. Intenta nuevamente más tarde.");
        setIsLoading(false);
      }
    };

    fetchDebateAndComments();
  }, [id]);

  // Format date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  // Handle vote on debate
  const handleDebateVote = async (voteType: "up" | "down") => {
    if (!user || !debate) {
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
            reference_id: debate.id, 
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
      if (voteType === "up") {
        setDebate({ ...debate, votes_up: debate.votes_up + 1 });
      } else {
        setDebate({ ...debate, votes_down: debate.votes_down + 1 });
      }

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

  // Handle vote on comment
  const handleCommentVote = async (commentId: string, voteType: "up" | "down") => {
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
            reference_id: commentId, 
            reference_type: "comment", 
            vote_type: voteType 
          }
        ]);

      if (error) {
        // If the error is because of a unique constraint violation,
        // it means the user already voted
        if (error.code === "23505") {
          toast({
            title: "Voto duplicado",
            description: "Ya has votado en este comentario",
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
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar el voto",
        variant: "destructive",
      });
    }
  };

  // Handle delete debate
  const handleDeleteDebate = async () => {
    if (!user || !debate || isDeleting) return;

    if (!canModerateContent(userRole) && user.id !== debate.author_id) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para eliminar este debate",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("debates")
        .delete()
        .eq("id", debate.id);

      if (error) {
        throw error;
      }
      
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

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!canModerateContent(userRole) && user.id !== comment.author_id) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para eliminar este comentario",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        throw error;
      }

      setComments(comments.filter((comment) => comment.id !== commentId));
      if (debate) {
        setDebate({ ...debate, comments_count: debate.comments_count - 1 });
      }

      toast({
        title: "Comentario eliminado",
        description: "El comentario ha sido eliminado con éxito",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      });
    }
  };

  // Handle create comment
  const handleCreateComment = async (debateId: string, content: string) => {
    if (!user || !debate) return;

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          { 
            debate_id: debateId, 
            content, 
            author_id: user.id 
          }
        ])
        .select();

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear el comentario: " + error.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch the newly created comment with author info
      const { data: newCommentWithAuthor, error: fetchError } = await supabase
        .from("comments_with_authors")
        .select("*")
        .eq("id", data[0].id)
        .single();

      if (fetchError) {
        console.error("Error fetching new comment:", fetchError);
      } else {
        setComments([...comments, newCommentWithAuthor as Comment]);
        setDebate({ ...debate, comments_count: debate.comments_count + 1 });
      }

      toast({
        title: "Comentario publicado",
        description: "Tu comentario ha sido publicado con éxito",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el comentario",
        variant: "destructive",
      });
    }
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
                  
                  {(canModerateContent(userRole) || user?.id === debate.author_id) && (
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
