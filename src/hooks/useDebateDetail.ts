import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Debate, Comment } from "@/types/forum";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { canModerateContent, canAdminContent } from "@/types/user";
import { useNavigate } from "react-router-dom";

// Separate service for cleaner code organization
const debateDetailService = {
  // Fetch a single debate with author info
  fetchDebate: async (debateId: string) => {
    const { data, error } = await supabase
      .from("debates_with_authors")
      .select("*")
      .eq("id", debateId)
      .single();

    if (error) throw error;
    return data as Debate;
  },
  
  // Fetch comments for a debate
  fetchComments: async (debateId: string) => {
    const { data, error } = await supabase
      .from("comments_with_authors")
      .select("*")
      .eq("debate_id", debateId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Comment[];
  },
  
  // Register a vote on a debate
  registerDebateVote: async (debateId: string, voteType: "up" | "down", userId: string) => {
    const { error } = await supabase
      .from("votes")
      .insert([
        { 
          user_id: userId, 
          reference_id: debateId, 
          reference_type: "debate", 
          vote_type: voteType 
        }
      ]);

    if (error) {
      if (error.code === "23505") {
        throw new Error("duplicate_vote");
      }
      throw error;
    }
  },
  
  // Register a vote on a comment
  registerCommentVote: async (commentId: string, voteType: "up" | "down", userId: string) => {
    const { error } = await supabase
      .from("votes")
      .insert([
        { 
          user_id: userId, 
          reference_id: commentId, 
          reference_type: "comment", 
          vote_type: voteType 
        }
      ]);

    if (error) {
      if (error.code === "23505") {
        throw new Error("duplicate_vote");
      }
      throw error;
    }
  },
  
  // Delete a debate
  deleteDebate: async (debateId: string) => {
    const { error } = await supabase
      .from("debates")
      .delete()
      .eq("id", debateId);

    if (error) throw error;
  },
  
  // Delete a comment
  deleteComment: async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;
  },
  
  // Create a new comment
  createComment: async (debateId: string, content: string, userId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .insert([
        { 
          debate_id: debateId, 
          content, 
          author_id: userId 
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  },
  
  // Fetch a newly created comment with author info
  fetchNewComment: async (commentId: string) => {
    const { data, error } = await supabase
      .from("comments_with_authors")
      .select("*")
      .eq("id", commentId)
      .single();

    if (error) throw error;
    return data as Comment;
  },
  
  // Add experience points
  addXp: async (userId: string, actionName: string, description: string) => {
    await supabase.rpc('add_user_xp', { 
      _user_id: userId,
      _action_name: actionName,
      _custom_description: description
    });
  }
};

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
        // Fetch debate
        const debateData = await debateDetailService.fetchDebate(debateId);
        setDebate(debateData);

        // Fetch comments
        const commentsData = await debateDetailService.fetchComments(debateId);
        setComments(commentsData);
        
        setError(null);
      } catch (err: any) {
        console.error("Error loading debate:", err);
        setError("No se pudo cargar el debate. Intenta nuevamente más tarde.");
      } finally {
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
      await debateDetailService.registerDebateVote(debate.id, voteType, user.id);

      // Update local state
      if (voteType === "up") {
        setDebate({ ...debate, votes_up: debate.votes_up + 1 });
      } else {
        setDebate({ ...debate, votes_down: debate.votes_down + 1 });
      }

      // Add XP
      await debateDetailService.addXp(
        user.id, 
        'vote_forum', 
        `Voto en debate: ${debate.title}`
      );

      toast({
        title: "Voto registrado",
        description: "Tu voto ha sido registrado con éxito",
      });
    } catch (err: any) {
      if (err.message === "duplicate_vote") {
        toast({
          title: "Voto duplicado",
          description: "Ya has votado en este debate",
          variant: "destructive",
        });
      } else {
        console.error("Error voting:", err);
        toast({
          title: "Error",
          description: "No se pudo registrar el voto",
          variant: "destructive",
        });
      }
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
      await debateDetailService.registerCommentVote(commentId, voteType, user.id);

      // Update local state
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

      // Add XP
      await debateDetailService.addXp(
        user.id, 
        'vote_forum', 
        `Voto en comentario`
      );

      toast({
        title: "Voto registrado",
        description: "Tu voto ha sido registrado con éxito",
      });
    } catch (err: any) {
      if (err.message === "duplicate_vote") {
        toast({
          title: "Voto duplicado",
          description: "Ya has votado en este comentario",
          variant: "destructive",
        });
      } else {
        console.error("Error voting:", err);
        toast({
          title: "Error",
          description: "No se pudo registrar el voto",
          variant: "destructive",
        });
      }
    }
  };

  // Delete debate
  const handleDeleteDebate = async () => {
    if (!user || !debate || isDeleting) return;

    if (!canAdminContent(userRole) && user.id !== debate.author_id) {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden eliminar debates de otros usuarios",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      await debateDetailService.deleteDebate(debate.id);
      
      toast({
        title: "Debate eliminado",
        description: "El debate ha sido eliminado con éxito",
      });
      
      navigate("/forum");
    } catch (err) {
      console.error("Error deleting debate:", err);
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

    if (!canAdminContent(userRole) && user.id !== comment.author_id) {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden eliminar comentarios de otros usuarios",
        variant: "destructive",
      });
      return;
    }

    try {
      await debateDetailService.deleteComment(commentId);

      // Update local state
      setComments(comments.filter((comment) => comment.id !== commentId));
      if (debate) {
        setDebate({ ...debate, comments_count: debate.comments_count - 1 });
      }

      toast({
        title: "Comentario eliminado",
        description: "El comentario ha sido eliminado con éxito",
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
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
      const newComment = await debateDetailService.createComment(debateId, content, user.id);
      const newCommentWithAuthor = await debateDetailService.fetchNewComment(newComment.id);
      
      // Update local state
      setComments([...comments, newCommentWithAuthor]);
      setDebate({ ...debate, comments_count: debate.comments_count + 1 });

      // Add XP
      await debateDetailService.addXp(
        user.id, 
        'create_comment', 
        `Comentario en debate: ${debate.title}`
      );

      toast({
        title: "Comentario publicado",
        description: "Tu comentario ha sido publicado con éxito",
      });
    } catch (err) {
      console.error("Error creating comment:", err);
      toast({
        title: "Error",
        description: "No se pudo crear el comentario",
        variant: "destructive",
      });
    }
  };

  // Modified to return a badge type instead of JSX directly
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "verified":
        return {
          className: "bg-club-orange/20 text-club-orange text-xs px-2 py-0.5 rounded-full ml-2",
          text: "Verificado"
        };
      case "moderator":
        return {
          className: "bg-club-green/20 text-club-green text-xs px-2 py-0.5 rounded-full ml-2",
          text: "Moderador"
        };
      case "admin":
        return {
          className: "bg-club-brown/20 text-club-brown text-xs px-2 py-0.5 rounded-full ml-2",
          text: "Admin"
        };
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
