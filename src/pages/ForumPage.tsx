
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ForumSidebar from "@/components/forum/ForumSidebar";
import DebateList from "@/components/forum/DebateList";
import { useUser } from "@/hooks/useUser";
import { useDebates } from "@/hooks/useDebates";
import { useToast } from "@/hooks/use-toast";

const ForumPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user, userRole, isLoading: isUserLoading } = useUser();
  const { 
    debates, 
    isLoading: isDebatesLoading, 
    error, 
    handleCreateDebate, 
    handleVote, 
    handleDeleteDebate 
  } = useDebates(selectedCategory);

  const categories = ["General", "Legal", "Tecnología", "Finanzas", "Salud", "Audiovisual", "Eventos"];

  useEffect(() => {
    console.log("ForumPage render - debates:", debates.length, "userRole:", userRole);
  }, [debates, userRole]);

  const onCreateDebate = async (title: string, content: string, category: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para crear debates",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Creating debate with user:", user.id, "Role:", userRole);
    
    try {
      const success = await handleCreateDebate(title, content, category, user.id);
      if (success) {
        console.log("Debate created successfully");
      } else {
        console.error("Failed to create debate");
      }
    } catch (error) {
      console.error("Error in onCreateDebate:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el debate",
        variant: "destructive",
      });
    }
  };

  const onVote = async (debateId: string, voteType: "up" | "down") => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para votar",
        variant: "destructive",
      });
      return;
    }

    await handleVote(debateId, voteType, user.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-club-brown mb-6">Foro de discusión</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <ForumSidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onCreateDebate={onCreateDebate}
            userRole={userRole}
            userId={user?.id}
          />
          
          {/* Main content */}
          <div className="lg:col-span-2">
            <DebateList 
              debates={debates}
              isLoading={isUserLoading || isDebatesLoading}
              error={error}
              userRole={userRole}
              userId={user?.id}
              onVote={onVote}
              onDelete={handleDeleteDebate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
