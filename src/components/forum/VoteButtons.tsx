
import React from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoteButtonsProps } from "./types/debate-types";

const VoteButtons: React.FC<VoteButtonsProps> = ({ 
  debateId, 
  votesUp, 
  votesDown, 
  commentsCount, 
  userId, 
  onVote 
}) => {
  const { toast } = useToast();

  const handleVote = (e: React.MouseEvent, voteType: "up" | "down") => {
    e.stopPropagation(); // Prevent navigation when voting
    
    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar debates",
        variant: "destructive",
      });
      return;
    }

    if (onVote) {
      onVote(debateId, voteType);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <button 
          onClick={(e) => handleVote(e, "up")}
          className="text-gray-500 hover:text-club-green transition-colors"
          aria-label="Votar positivamente"
        >
          <ThumbsUp size={18} />
        </button>
        <span className="text-sm">{votesUp}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <button 
          onClick={(e) => handleVote(e, "down")}
          className="text-gray-500 hover:text-club-terracotta transition-colors"
          aria-label="Votar negativamente"
        >
          <ThumbsDown size={18} />
        </button>
        <span className="text-sm">{votesDown}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <MessageSquare size={18} className="text-gray-500" />
        <span className="text-sm">{commentsCount}</span>
      </div>
    </div>
  );
};

export default VoteButtons;
