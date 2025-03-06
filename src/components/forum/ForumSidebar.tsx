
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CategoryFilter from "@/components/forum/CategoryFilter";
import CreateDebateForm from "@/components/forum/CreateDebateForm";
import { UserRole } from "@/types/user";

interface ForumSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onCreateDebate: (title: string, content: string, category: string) => Promise<void>;
  userRole: UserRole;
  userId?: string;
}

const ForumSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onCreateDebate,
  userRole,
  userId
}: ForumSidebarProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="lg:col-span-1">
      <div className="mb-6">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full bg-club-orange hover:bg-club-terracotta text-white flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          {showCreateForm ? "Cancelar" : "Crear nuevo debate"}
        </Button>
      </div>
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      {showCreateForm && (
        <CreateDebateForm
          userRole={userRole}
          userId={userId}
          onSubmit={onCreateDebate}
        />
      )}
    </div>
  );
};

export default ForumSidebar;
