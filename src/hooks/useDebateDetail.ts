
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Debate, Comment } from "@/types/forum";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { canModerateContent } from "@/types/user";
import { useNavigate } from "react-router-dom";

export const useDebateDetail = (debateId: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole } = useUser();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  // Fetch debate and comments
  useEffect(() => {
    if (!debateId) return;

    const fetchDebateAndComments = async () => {
      setIsLoading(true);
      try {
        const { data: debateData, error: debateError } = await supabase
          .from("debates_with_authors")
          .select("*")
          .eq("id", debateId)
          .single();

        if (debateError) {
          throw debateError;
        }

        setDebate(debateData as Debate);

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments_with_authors")
          .select("*")
          .eq("debate_id", debateId)
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
  }, [debateId]);

  // Vote on debate
  const handleDebateVote = async (voteType: "up" | "down") => {
    if (!user || !debate) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar",
        variant: "destructive",
      });
      return;
    }

    if (userRole === "registered") {
      toast({
        title: "Nivel insuficiente",
        description: "Necesitas ser nivel 2 o superior para votar",
        variant: "destructive",
      });
      return;
    }

    try {
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

      if (voteType === "up") {
        setDebate({ ...debate, votes_up: debate.votes_up + 1 });
      } else {
        setDebate({ ...debate, votes_down: debate.votes_down + 1 });
      }

      await supabase.rpc('add_user_xp', { 
        _user_id: user.id,
        _action_name: 'vote_forum',
        _custom_description: `Voto en debate: ${debate.title}`
      });

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

  // Vote on comment
  const handleCommentVote = async (commentId: string, voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar",
        variant: "destructive",
      });
      return;
    }

    if (userRole === "registered") {
      toast({
        title: "Nivel insuficiente",
        description: "Necesitas ser nivel 2 o superior para votar",
        variant: "destructive",
      });
      return;
    }

    try {
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

      await supabase.rpc('add_user_xp', { 
        _user_id: user.id,
        _action_name: 'vote_forum',
        _custom_description: `Voto en comentario`
      });

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

  // Delete debate
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

  // Delete comment
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

  // Create comment
  const handleCreateComment = async (debateId: string, content: string) => {
    if (!user || !debate) return;

    if (userRole === "registered") {
      toast({
        title: "Nivel insuficiente",
        description: "Necesitas ser nivel 2 o superior para comentar",
        variant: "destructive",
      });
      return;
    }

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

      await supabase.rpc('add_user_xp', { 
        _user_id: user.id,
        _action_name: 'create_comment',
        _custom_description: `Comentario en debate: ${debate.title}`
      });

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

  return {
    debate,
    comments,
    isLoading,
    error,
    isDeleting,
    user,
    userRole,
    formatDate,
    renderRoleBadge,
    handleDebateVote,
    handleCommentVote,
    handleDeleteDebate,
    handleDeleteComment,
    handleCreateComment
  };
};
