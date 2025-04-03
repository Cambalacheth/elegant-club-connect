
import React from "react";
import CommentCard from "@/components/forum/CommentCard";
import CommentForm from "@/components/forum/CommentForm";
import { Comment } from "@/types/forum";
import { UserRole } from "@/types/user";

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
              onVote={onCommentVote}
              onDelete={onCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
