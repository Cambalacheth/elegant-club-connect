
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import RichTextDisplay from "./RichTextDisplay";
import VoteButtons from "./VoteButtons";
import DeleteButton from "./DeleteButton";
import RoleBadge from "./RoleBadge";
import { formatDate } from "./FormatUtils";
import { DebateCardProps } from "./types/debate-types";

const DebateCard = ({ debate, userRole, userId, onVote, onDelete }: DebateCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    navigate(`/forum/${debate.id}`);
  };

  const handleDelete = async (debateId: string) => {
    try {
      setIsDeleting(true);
      if (onDelete) {
        onDelete(debateId);
      }
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

  const contentPreview = debate.content.length > 250 
    ? debate.content.substring(0, 250) + "..." 
    : debate.content;

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-club-brown hover:text-club-terracotta transition-colors">
            {debate.title}
          </h3>
          <span className="text-xs text-gray-500">{formatDate(debate.created_at)}</span>
        </div>
        
        <div className="mb-4 text-gray-700 overflow-hidden">
          <div className="line-clamp-3">
            <RichTextDisplay content={contentPreview} className="text-sm" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src={debate.author_avatar || "/placeholder.svg"} 
              alt={debate.author_username} 
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">{debate.author_username}</span>
            <RoleBadge role={debate.author_role} />
          </div>
          
          <div onClick={(e) => e.stopPropagation()} className="flex items-center">
            <VoteButtons 
              debateId={debate.id}
              votesUp={debate.votes_up}
              votesDown={debate.votes_down}
              commentsCount={debate.comments_count}
              userId={userId}
              onVote={onVote}
            />
            
            <DeleteButton 
              debateId={debate.id}
              authorId={debate.author_id}
              userId={userId}
              userRole={userRole}
              isDeleting={isDeleting}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
