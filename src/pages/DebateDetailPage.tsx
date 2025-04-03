
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import DebateContent from "@/components/forum/DebateContent";
import CommentSection from "@/components/forum/CommentSection";
import DebateLoadingState from "@/components/forum/DebateLoadingState";
import { useDebateDetail } from "@/hooks/useDebateDetail";

const DebateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
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
  } = useDebateDetail(id || "");

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
        
        {isLoading || error || !debate ? (
          <DebateLoadingState isLoading={isLoading} error={error} />
        ) : (
          <div>
            <DebateContent 
              debate={debate}
              userRole={userRole}
              userId={user?.id}
              isDeleting={isDeleting}
              formatDate={formatDate}
              renderRoleBadge={renderRoleBadge}
              onVote={handleDebateVote}
              onDelete={handleDeleteDebate}
            />
            
            <CommentSection
              debateId={debate.id}
              comments={comments}
              userRole={userRole}
              userId={user?.id}
              onCommentVote={handleCommentVote}
              onCommentDelete={handleDeleteComment}
              onCommentCreate={handleCreateComment}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateDetailPage;
