
import { useState, useEffect } from "react";
import { Debate, Comment } from "@/types/forum";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { canAdminContent } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { debateDetailService } from "@/services/debateDetailService";
import { formatDate, renderRoleBadge } from "@/utils/forumUtils";
import { experienceService } from "@/services/experienceService";

export const useDebateDetail = (debateId: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole } = useUser();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      await experienceService.addXp(
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
      await experienceService.addXp(
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
      await experienceService.addXp(
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
