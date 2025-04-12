
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Trash2, AlertCircle } from "lucide-react";
import { Comment } from "@/types/forum";
import { canModerateContent, UserRole } from "@/types/user";
import RichTextDisplay from "./RichTextDisplay";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CommentCardProps {
  comment: Comment;
  userRole: UserRole;
  userId?: string;
  formatDate: (date: string) => string;
  renderRoleBadge: (role: string) => { className: string; text: string } | null;
  onCommentVote: (commentId: string, voteType: "up" | "down") => void;
  onCommentDelete: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  userRole,
  userId,
  formatDate,
  renderRoleBadge,
  onCommentVote,
  onCommentDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onCommentDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <img 
            src={comment.author_avatar || "/placeholder.svg"} 
            alt={comment.author_username} 
            className="w-6 h-6 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">{comment.author_username}</span>
              {/* Render role badge using the new format */}
              {renderRoleBadge(comment.author_role) && (
                <span className={renderRoleBadge(comment.author_role)?.className || ""}>
                  {renderRoleBadge(comment.author_role)?.text}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
      </div>
      
      <div className="mb-3">
        <RichTextDisplay content={comment.content} className="text-sm text-gray-700" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => onCommentVote(comment.id, "up")}
              className="text-gray-500 hover:text-club-green transition-colors"
              aria-label="Votar positivamente"
            >
              <ThumbsUp size={16} />
            </button>
            <span className="text-xs">{comment.votes_up}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => onCommentVote(comment.id, "down")}
              className="text-gray-500 hover:text-club-terracotta transition-colors"
              aria-label="Votar negativamente"
            >
              <ThumbsDown size={16} />
            </button>
            <span className="text-xs">{comment.votes_down}</span>
          </div>
        </div>
        
        {(canModerateContent(userRole) || userId === comment.author_id) && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Eliminar comentario"
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  ¿Eliminar comentario?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El comentario será eliminado permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
