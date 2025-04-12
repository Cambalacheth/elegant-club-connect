
import React from "react";
import CommentCard from "@/components/forum/CommentCard";
import CommentForm from "@/components/forum/CommentForm";
import { Comment } from "@/types/forum";
import { UserRole } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface CommentSectionProps {
  debateId: string;
  comments: Comment[];
  userRole: UserRole;
  userId?: string;
  onCommentVote: (commentId: string, voteType: "up" | "down") => void;
  onCommentDelete: (commentId: string) => void;
  onCommentCreate: (debateId: string, content: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  debateId,
  comments,
  userRole,
  userId,
  onCommentVote,
  onCommentDelete,
  onCommentCreate
}) => {
  // Format date helper function
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  };

  // Role badge helper function
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

  return (
    <div className="mb-6">
      <CommentForm
        debateId={debateId}
        userRole={userRole}
        userId={userId}
        onSubmit={onCommentCreate}
      />
      
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
              userId={userId}
              formatDate={formatDate}
              renderRoleBadge={renderRoleBadge}
              onCommentVote={onCommentVote}
              onCommentDelete={onCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
