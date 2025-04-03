
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Comment } from "@/types/forum";
import { UserRole, canModerateContent } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface CommentCardProps {
  comment: Comment;
  userRole: UserRole;
  userId?: string;
  onVote?: (commentId: string, voteType: "up" | "down") => void;
  onDelete?: (commentId: string) => void;
}

const CommentCard = ({ comment, userRole, userId, onVote, onDelete }: CommentCardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleVote = (voteType: "up" | "down") => {
    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar comentarios",
        variant: "destructive",
      });
      return;
    }

    if (onVote) {
      onVote(comment.id, voteType);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  // Only admins can see and render role badge
  const renderRoleBadge = () => {
    if (userRole === 'admin') {
      switch (comment.author_role) {
        case "verified":
          return <span className="bg-club-orange/20 text-club-orange text-xs px-2 py-0.5 rounded-full">Verificado</span>;
        case "moderator":
          return <span className="bg-club-green/20 text-club-green text-xs px-2 py-0.5 rounded-full">Moderador</span>;
        case "admin":
          return <span className="bg-club-brown/20 text-club-brown text-xs px-2 py-0.5 rounded-full">Admin</span>;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <img 
            src={comment.author_avatar || "/placeholder.svg"} 
            alt={comment.author_username} 
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-700">{comment.author_username}</span>
          {renderRoleBadge()}
        </div>
        <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-700">{comment.content}</p>
      </div>
      
      <div className="flex justify-end items-center space-x-4">
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => handleVote("up")}
            className="text-gray-500 hover:text-club-green transition-colors"
            aria-label="Votar positivamente"
          >
            <ThumbsUp size={16} />
          </button>
          <span className="text-sm">{comment.votes_up}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => handleVote("down")}
            className="text-gray-500 hover:text-club-terracotta transition-colors"
            aria-label="Votar negativamente"
          >
            <ThumbsDown size={16} />
          </button>
          <span className="text-sm">{comment.votes_down}</span>
        </div>
        
        {canModerateContent(userRole) && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Eliminar comentario"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
